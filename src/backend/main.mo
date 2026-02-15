import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Product = {
    id : Text;
    category : Text;
    name : Text;
    size : Text;
    quantity : Nat;
    image : ?Storage.ExternalBlob;
    description : Text;
    price : Nat;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      switch (Text.compare(product1.category, product2.category)) {
        case (#equal) { Text.compare(product1.name, product2.name) };
        case (order) { order };
      };
    };
  };

  public type UserProfile = {
    name : Text;
    // You can extend with more user data here if needed
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  type Order = {
    id : Text;
    user : Principal;
    items : [CartItem];
    total : Nat;
  };

  let productStore = Map.empty<Text, Product>();
  let cartStore = Map.empty<Principal, [CartItem]>();
  let orderStore = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // CEO Photo (Only Admin - Niraj)
  var ceoPhoto : ?Storage.ExternalBlob = null;

  public query ({ caller }) func getCeoPhoto() : async ?Storage.ExternalBlob {
    ceoPhoto;
  };

  public shared ({ caller }) func updateCeoPhoto(newPhoto : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin (Niraj) can update CEO photo");
    };
    ceoPhoto := ?newPhoto;
  };

  // Website Logo (Only Admin - Niraj)
  var logo : ?Storage.ExternalBlob = null;

  public query ({ caller }) func getLogo() : async ?Storage.ExternalBlob {
    logo;
  };

  public shared ({ caller }) func updateLogo(newLogo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin (Niraj) can update site logo");
    };
    logo := ?newLogo;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Catalog (Public Read Access)
  public query ({ caller }) func getAllProducts() : async [Product] {
    productStore.values().toArray().sort();
  };

  public query ({ caller }) func getProduct(id : Text) : async ?Product {
    productStore.get(id);
  };

  // Admin Product Management (CRUD)
  public shared ({ caller }) func createProduct(product : Product) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let productId = productStore.size().toText() # "_" # product.name;
    let newProduct = {
      product with
      id = productId;
    };
    productStore.add(productId, newProduct);
    productId;
  };

  public shared ({ caller }) func updateProduct(id : Text, product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (productStore.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct = {
          product with
          id = id;
        };
        productStore.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (productStore.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        productStore.remove(id);
      };
    };
  };

  // Cart Management (User Only)
  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access carts");
    };
    switch (cartStore.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    switch (productStore.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let currentCart = switch (cartStore.get(caller)) {
          case (?items) { items };
          case (null) { [] };
        };

        let updatedCart = currentCart.map(
          func(item) {
            if (item.productId == productId) {
              { productId = item.productId; quantity = item.quantity + quantity };
            } else {
              item;
            };
          }
        );

        let itemExists = currentCart.find(
          func(item) { item.productId == productId },
        );

        let finalCart = switch (itemExists) {
          case (?_) { updatedCart };
          case (null) {
            currentCart.concat([{ productId; quantity }]);
          };
        };

        cartStore.add(caller, finalCart);
      };
    };
  };

  public shared ({ caller }) func updateCartItem(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart items");
    };
    let currentCart = switch (cartStore.get(caller)) {
      case (?items) { items };
      case (null) { Runtime.trap("Cart is empty") };
    };

    if (quantity == 0) {
      let updatedCart = currentCart.filter(
        func(item) { item.productId != productId },
      );
      cartStore.add(caller, updatedCart);
    } else {
      let updatedCart = currentCart.map(
        func(item) {
          if (item.productId == productId) {
            { productId = item.productId; quantity = quantity };
          } else {
            item;
          };
        }
      );
      cartStore.add(caller, updatedCart);
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    let currentCart = switch (cartStore.get(caller)) {
      case (?items) { items };
      case (null) { Runtime.trap("Cart is empty") };
    };

    let updatedCart = currentCart.filter(
      func(item) { item.productId != productId },
    );
    cartStore.add(caller, updatedCart);
  };

  public shared ({ caller }) func calculateCartTotal() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can calculate cart total");
    };
    let currentCart = switch (cartStore.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };

    currentCart.foldLeft<CartItem, Nat>(
      0,
      func(acc, item) {
        switch (productStore.get(item.productId)) {
          case (?product) {
            acc + (product.price * item.quantity);
          };
          case (null) { acc };
        };
      }
    );
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    cartStore.add(caller, []);
  };

  // Order Management (User Only)
  public shared ({ caller }) func placeOrder() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place order");
    };
    let items = switch (cartStore.get(caller)) {
      case (?cartItems) { cartItems };
      case (null) { [] };
    };
    if (items.size() == 0) { Runtime.trap("Cart is empty") };

    let orderId = (orderStore.size() + 1).toText();
    let total = await calculateCartTotal();
    let order = { id = orderId; user = caller; items; total };
    orderStore.add(orderId, order);
    cartStore.add(caller, []);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get orders");
    };
    switch (orderStore.get(orderId)) {
      case (?order) {
        if (order.user == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get orders");
    };
    orderStore.values().toArray().filter<Order>(
      func(order) { order.user == caller },
    );
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all orders");
    };
    orderStore.values().toArray();
  };
};

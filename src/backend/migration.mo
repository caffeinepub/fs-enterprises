import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
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

  type UserProfile = {
    name : Text;
    // You can extend with more user data here if needed
  };

  type OldActor = {
    productStore : Map.Map<Text, Product>;
    cartStore : Map.Map<Principal, [CartItem]>;
    orderStore : Map.Map<Text, Order>;
    userProfiles : Map.Map<Principal, UserProfile>;
    ceoPhoto : ?Storage.ExternalBlob;
  };

  type NewActor = {
    productStore : Map.Map<Text, Product>;
    cartStore : Map.Map<Principal, [CartItem]>;
    orderStore : Map.Map<Text, Order>;
    userProfiles : Map.Map<Principal, UserProfile>;
    ceoPhoto : ?Storage.ExternalBlob;
    logo : ?Storage.ExternalBlob;
  };

  public func run(old : OldActor) : NewActor {
    { old with logo = null };
  };
};

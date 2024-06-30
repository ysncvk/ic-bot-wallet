import Principal "mo:base/Principal";
import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Bool "mo:base/Bool";
import Option "mo:base/Option";
import Error "mo:base/Error";



actor ICPWallet {

  var allowedCaller : ?Principal = null;

  func guard(caller: Principal) : async Bool {
    switch (allowedCaller) {
      case (null) {
        // İlk çağrıyı yapan canister'ı sakla
        allowedCaller := ?caller;
        return true;
      };
      case (?allowed) {
        // İlk çağrıyı yapan canister'ın aynı olup olmadığını kontrol et
        return Principal.equal(allowed, caller);
      };
    };
  };

  type TelegramId = Nat32;
  type User = { 
    principalId: Principal;
    accountId: Text;
    publicKey: Text;
    privateKey: Text;
    salt: Text;
    tokens: [Text];
  };

   type ResponseUser = { 
    telegramId: TelegramId;
    principalId: Principal;
    accountId: Text;   
  };


  private stable var users : Trie.Trie<TelegramId, User> = Trie.empty();

  public shared query func checkUser(telegramId: TelegramId) : async Bool {
    let result = Trie.find(users, key(telegramId), Nat32.equal);
    let exists = Option.isSome(result);
    return exists;
  };

  public shared func createUser (telegramId:TelegramId, user: User): async Bool{
    users := Trie.replace(
      users,
      key(telegramId),
      Nat32.equal,
      ?user,
    ).0;
     true;
  };

  public shared(msg) func getUser(telegramId: TelegramId) : async ?User {

    let isAllowed = await guard(msg.caller);
    if (isAllowed) {
      let result = Trie.find(users, key(telegramId), Nat32.equal);
      return result;
    } else {
      throw Error.reject("Unauthorized caller");
    }
     
  };

   public shared(msg) func getUsers () : async [ResponseUser]  {
    let isAllowed = await guard(msg.caller);
    if (isAllowed) {
    return Trie.toArray<TelegramId, User, ResponseUser>(
        users,
        func (k, v) : (ResponseUser) {
        { telegramId = k; principalId = v.principalId; accountId = v.accountId}
      }
    );
    }  else {
      throw Error.reject("Unauthorized caller");
    }
  };

  public func delete(telegramId : TelegramId) : async Bool {
    let result = Trie.find(users, key(telegramId), Nat32.equal);
    let exists = Option.isSome(result);
    if (exists) {
      users := Trie.replace(
        users,
        key(telegramId),
        Nat32.equal,
        null,
      ).0;
    };
    return exists;
  };

  private func key(x : TelegramId) : Trie.Key<TelegramId> {
    return { hash = x; key = x };
  };
}
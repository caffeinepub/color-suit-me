import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

actor {
  type Color = {
    hex : Text;
    name : Text;
    family : Text; // "warm", "cool", "neutral", "fashion"
  };

  type VoteStats = {
    votes : Nat;
    likes : Nat;
  };

  type Session = {
    colors : [(Color, Bool)];
    familyStats : [(Text, VoteStats)];
    season : Text; // "Spring", "Summer", "Autumn", "Winter"
  };

  module Session {
    public func compare(s1 : Session, s2 : Session) : Order.Order {
      Nat.compare(s1.colors.size(), s2.colors.size());
    };
  };

  let sessions = Map.empty<Text, Session>();

  func getSessionInternal(sessionId : Text) : Session {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?session) { session };
    };
  };

  public query ({ caller }) func getSession(sessionId : Text) : async Session {
    getSessionInternal(sessionId);
  };

  public shared ({ caller }) func addVote(sessionId : Text, color : Color, liked : Bool) : async () {
    let session = getSessionInternal(sessionId);
    let updatedColors = session.colors.concat([(color, liked)]);
    let updatedFamilyStats = session.familyStats.map(func((family, stats)) { if (family == color.family) { (family, { votes = stats.votes + 1; likes = stats.likes + (if (liked) { 1 } else { 0 }) }) } else { (family, stats) } });
    let updatedSession = {
      colors = updatedColors;
      familyStats = updatedFamilyStats;
      season = session.season;
    };
    sessions.add(sessionId, updatedSession);
  };

  public shared ({ caller }) func createSession(sessionId : Text) : async () {
    if (sessions.containsKey(sessionId)) { Runtime.trap("Session already exists") };
    let initialFamilyStats = [("warm", { votes = 0; likes = 0 }), ("cool", { votes = 0; likes = 0 }), ("neutral", { votes = 0; likes = 0 }), ("fashion", { votes = 0; likes = 0 })];
    let newSession = {
      colors = [];
      familyStats = initialFamilyStats;
      season = "Spring"; // default
    };
    sessions.add(sessionId, newSession);
  };

  public shared ({ caller }) func setSeason(sessionId : Text, season : Text) : async () {
    let session = getSessionInternal(sessionId);
    let updatedSession = {
      colors = session.colors;
      familyStats = session.familyStats;
      season;
    };
    sessions.add(sessionId, updatedSession);
  };

  public query ({ caller }) func getRecommendedFamily(sessionId : Text) : async Text {
    let session = getSessionInternal(sessionId);
    var bestRatio : Float = 0;
    var bestFamily : Text = "warm";
    for ((family, stats) in session.familyStats.values()) {
      if (stats.votes > 0) {
        let ratio = stats.likes.toFloat() / stats.votes.toFloat();
        if (ratio > bestRatio) {
          bestRatio := ratio;
          bestFamily := family;
        };
      };
    };
    bestFamily;
  };

  public query ({ caller }) func getLikedColors(sessionId : Text) : async [Color] {
    let session = getSessionInternal(sessionId);
    session.colors.filter(func((_, liked)) { liked }).map(func((color, _)) { color });
  };

  public query ({ caller }) func getAllSessions() : async [Session] {
    sessions.values().toArray().sort();
  };
};

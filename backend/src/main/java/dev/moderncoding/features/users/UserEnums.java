package dev.moderncoding.features.users;

/** Fixed values owned by this feature. */
public final class UserEnums {
    private UserEnums() {}

    public enum AccountType {
        STANDARD, CREATOR, BUSINESS, TEST
    }

    public enum Status {
        ACTIVE, SUSPENDED, DELETED
    }

    /** MUTE hides content; RESTRICT is reserved for feature-specific interaction limits. */
    public enum InteractionType { FOLLOW, BLOCK, RESTRICT, MUTE }

    public enum IdentityProvider {
        GOOGLE, MICROSOFT
    }
}

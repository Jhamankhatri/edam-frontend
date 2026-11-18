/**
 * Generated from the pinned backend OpenAPI snapshot. DO NOT EDIT BY HAND.
 *
 * Source: openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json
 * Backend commit: 620f7a795cc67a16e905115131f561bbd986af85
 * Backend Actions run: 44395699755 (artifact openapi-620f7a795cc67a16e905115131f561bbd986af85)
 * SHA-256: 9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d
 * Generator: openapi-typescript 7.13.0; regenerate with `npm run types:generate`.
 * See docs/PHASE1_STEP1_CONTRACT_NOTES.md §14 for the snapshot update procedure.
 */

export interface paths {
    "/api/v1/workflows/{definitionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Rename or rebind a definition
         * @description Rebinding the request type is refused while a revision is published: it would move future requests of both types onto this chain without an explicit decision.
         */
        put: operations["update"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/{definitionId}/draft": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Create or replace the definition's single draft revision
         * @description The whole graph is replaced: what the caller last sent is exactly what would be published. A definition holds at most one draft, so the document under review cannot be confused with another.
         */
        put: operations["saveDraft"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one user with roles and data scopes
         * @description A user outside the caller's data scope is reported as not found, not forbidden, so the caller cannot map which records exist.
         */
        get: operations["get"];
        /** Update a user's profile and organizational placement */
        put: operations["update_1"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/themes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one theme by id */
        get: operations["getTheme"];
        /** Update a theme */
        put: operations["updateTheme"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/roles/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one role */
        get: operations["get_1"];
        /**
         * Rename or re-describe a role
         * @description The code cannot be changed. System roles may be edited but not deactivated.
         */
        put: operations["update_2"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/roles/{id}/permissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Replace a role's permission set
         * @description A caller cannot grant a permission they do not hold themselves, which is what stops role management from becoming a privilege-escalation path.
         */
        put: operations["setPermissions"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recommending-authorities/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one recommending-authority designation */
        get: operations["get_2"];
        /** Transfer a designation to another person, or close its period */
        put: operations["update_3"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/units/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Rename or re-parent an organization unit
         * @description Re-parenting is refused when it would create a cycle.
         */
        put: operations["updateUnit"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/departments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a department */
        put: operations["updateDepartment"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/branches/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a branch */
        put: operations["updateBranch"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/vendors/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read one vendor */
        get: operations["vendor"];
        /** Update a vendor */
        put: operations["updateVendor"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/tax-authorities/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a tax authority */
        put: operations["updateTaxAuthority"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/currencies/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update a currency's name, symbol or precision
         * @description The ISO code is immutable: historical rates and snapshots reference it.
         */
        put: operations["updateCurrency"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Integration configuration detail (secrets never returned) */
        get: operations["detail"];
        /** Update an integration configuration. Omitting secret preserves existing value. */
        put: operations["update_4"];
        post?: never;
        /** Archive an integration (soft-delete, execution history retained) */
        delete: operations["archive"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-requests/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one request with its detail, allocations, items and quotations
         * @description A request outside the caller's scope is reported as not found rather than forbidden.
         */
        get: operations["get_3"];
        /**
         * Replace an editable request
         * @description Only the requester may change a request, and only while it is a draft or was returned for correction. Supports Idempotency-Key.
         */
        put: operations["update_5"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/subcategories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a subcategory */
        put: operations["updateSubcategory"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/categories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update a category
         * @description The expense type of an existing category cannot change; see the service contract.
         */
        put: operations["updateCategory"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/exceeding-limit-rules/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one exceeding-limit rule */
        get: operations["get_4"];
        /** Change an exceeding-limit rule */
        put: operations["update_6"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/events/{eventCode}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update channel/template/group routing for an event */
        put: operations["update_7"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/email-templates/{id}/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Activate or deactivate a template */
        put: operations["setActive"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/business-rules/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a rule set with its active/draft version and rules */
        get: operations["get_5"];
        /** Update rule-set metadata or active flag */
        put: operations["update_8"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/business-rules/versions/{versionId}/rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Create or update a rule inside a DRAFT version */
        put: operations["upsertRule"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approval-limits/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one approval limit */
        get: operations["get_6"];
        /**
         * Change a limit's amount or close its period
         * @description The department, holder, currency and classification are not editable: a different authority is a different limit.
         */
        put: operations["update_9"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List workflow definitions
         * @description Each definition reports its published revision, if any, and its version history.
         */
        get: operations["list"];
        put?: never;
        /**
         * Create a workflow definition
         * @description Binding a definition to a request type is what gives OPEX and CAPEX their own chains.
         */
        post: operations["create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/{definitionId}/draft/from-version/{sourceVersionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Roll back: start a new draft from any prior revision
         * @description Creates (or replaces) the definition's editable draft with a copy of the source revision — published or retired — so that publishing it restores the prior behaviour. The source revision is never mutated; in-flight requests keep their pinned version.
         */
        post: operations["rollbackIntoDraft"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/{definitionId}/draft/from-published": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Start a new draft from the currently published revision
         * @description The usual path for a change: copy the live chain, edit it, publish it. The live revision is untouched throughout.
         */
        post: operations["clonePublished"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/{definitionId}/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Activate or deactivate a definition
         * @description A deactivated definition routes nothing, and publishing a revision on it is refused.
         */
        post: operations["setActive_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/versions/{versionId}/retire": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Retire a published revision without a replacement
         * @description Stops new submissions of that request type. In-flight requests are unaffected because each pins the revision it started under.
         */
        post: operations["retire"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/versions/{versionId}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish a draft revision, retiring the one it replaces
         * @description Refused when validation reports any error. In-flight requests keep the version they started under; only new submissions use this one.
         */
        post: operations["publish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search users, paged and restricted to the caller's data scope
         * @description Returns only users the caller may see. The scope predicate is applied in the query, so the paging metadata describes the same set as the rows.
         */
        get: operations["list_1"];
        put?: never;
        /**
         * Create a user
         * @description No password is accepted. A credential setup grant is issued and the user chooses their own password. Cannot grant a role holding permissions the caller lacks.
         */
        post: operations["create_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/unlock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Clear a lockout on a user account
         * @description Resets failedLoginCount and lockedUntil so the user may authenticate again. Has no effect on an account that is not locked.
         */
        post: operations["unlock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/scopes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Grant a data scope
         * @description Narrows where the user's role permissions apply. Only an installation-scoped caller may grant installation-wide scope.
         */
        post: operations["assignScope"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Roles assigned to a user, including expired assignments for history */
        get: operations["roles"];
        put?: never;
        /**
         * Grant a role
         * @description An optional expiry makes temporary elevation self-terminating. Refused if the role holds permissions the caller does not have.
         */
        post: operations["assignRole"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/password-reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Issue a password reset for a user
         * @description The administrator never sees or sets the password; a reset grant is issued and the link is delivered to the user.
         */
        post: operations["triggerPasswordReset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Activate or deactivate a user
         * @description A user cannot deactivate their own account, which would otherwise be a way to permanently lock out the only administrator.
         */
        post: operations["setActive_2"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/themes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List themes */
        get: operations["listThemes"];
        put?: never;
        /** Create a new theme */
        post: operations["createTheme"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/themes/{id}/default": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Promote a theme to the installation default */
        post: operations["setDefaultTheme"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/themes/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a theme */
        post: operations["setThemeActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all active application settings */
        get: operations["listSettings"];
        put?: never;
        /** Create or update a single setting */
        post: operations["saveSetting"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List roles with their permissions and active holder counts */
        get: operations["list_2"];
        put?: never;
        /**
         * Create a role
         * @description The code must be unique and is immutable afterwards, because workflow configuration and audit records refer to roles by code.
         */
        post: operations["create_2"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/roles/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a role */
        post: operations["setActive_3"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reporting/expense-requests/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Export the expense-request register
         * @description Exports the register using the same filters, scope and inclusive date semantics as the register endpoint. Formats: CSV (RFC 4180 with UTF-8 BOM and formula-injection prefixes), EXCEL (.xlsx via streaming SXSSF). Returns 400 if the matching set exceeds 200000 rows.
         */
        post: operations["export"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recommending-authorities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List recommending authorities, optionally for one department */
        get: operations["list_3"];
        put?: never;
        /**
         * Designate a recommending authority
         * @description The person must belong to the department. One active authority per department and classification over any period.
         */
        post: operations["create_3"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recommending-authorities/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a designation */
        post: operations["setActive_4"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List active organization units as a flat list */
        get: operations["units"];
        put?: never;
        /** Create an organization unit */
        post: operations["createUnit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/units/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate an organization unit */
        post: operations["setUnitActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read the organization profile */
        get: operations["getProfile"];
        put?: never;
        /**
         * Create the organization profile
         * @description Bootstraps the singleton profile. Fails if a profile already exists.
         */
        post: operations["createProfile"];
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update organization profile settings
         * @description Partial update: only the supplied fields are applied.
         */
        patch: operations["updateProfile"];
        trace?: never;
    };
    "/api/v1/organization/departments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List active departments */
        get: operations["departments"];
        put?: never;
        /**
         * Create a department
         * @description The backing organization unit is created in the same transaction.
         */
        post: operations["createDepartment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/departments/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a department */
        post: operations["setDepartmentActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/branches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List active branches */
        get: operations["branches"];
        put?: never;
        /** Create a branch */
        post: operations["createBranch"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/branches/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a branch */
        post: operations["setBranchActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/notifications/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark a notification as read (user-scoped) */
        post: operations["markRead"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/notifications/read-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark all notifications as read for the current user */
        post: operations["markAllRead"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/vendors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search vendors, paged */
        get: operations["vendors"];
        put?: never;
        /** Create a vendor */
        post: operations["createVendor"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/vendors/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a vendor */
        post: operations["setVendorActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/tax-authorities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List tax authorities */
        get: operations["taxAuthorities"];
        put?: never;
        /** Create a tax authority */
        post: operations["createTaxAuthority"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/tax-authorities/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a tax authority */
        post: operations["setTaxAuthorityActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/exchange-rates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List exchange-rate periods, newest first */
        get: operations["exchangeRates"];
        put?: never;
        /**
         * Record an effective period for a currency pair
         * @description Overlapping periods are refused, so exactly one rate can apply at any instant.
         */
        post: operations["createRate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/exchange-rates/{id}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Close an open-ended exchange-rate period
         * @description Sets effectiveTo (defaulting to now) so the rate stops applying. The rate value is not edited; conversions that happened under it still resolve to this row.
         */
        post: operations["closeRate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/currencies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List currencies
         * @description Inactive currencies are included only on request.
         */
        get: operations["currencies"];
        put?: never;
        /** Add a currency */
        post: operations["createCurrency"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/master-data/currencies/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a currency */
        post: operations["setCurrencyActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List integration configurations */
        get: operations["list_4"];
        put?: never;
        /** Create an integration configuration */
        post: operations["create_4"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/{id}/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Test an integration connection (no side effects on provider) */
        post: operations["test"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/{id}/executions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paginated execution history */
        get: operations["history"];
        put?: never;
        /** Enqueue an execution */
        post: operations["execute"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/{id}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Deactivate an integration (prevents new executions, retains history) */
        post: operations["deactivate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/{id}/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate an integration */
        post: operations["activate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/executions/{execId}/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Retry an eligible failed execution */
        post: operations["retry"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/feature-flags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all feature flags */
        get: operations["listFlags"];
        put?: never;
        /** Create or update a feature flag */
        post: operations["saveFlag"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/feature-flags/{key}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enable or disable a feature flag */
        post: operations["setFlagEnabled"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List requests visible to the caller
         * @description Scoped to the caller's data scopes. Set mineOnly=true for the 'My Request' register.
         */
        get: operations["list_5"];
        put?: never;
        /**
         * Create a request as a draft
         * @description The request number is allocated from the installation's sequence. A draft is checked for internal consistency only; completeness is enforced at submission. Supports Idempotency-Key.
         */
        post: operations["create_5"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-requests/{id}/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit a request for approval
         * @description Applies every conditional rule for the request's classification. Submission does not choose approvers: routing belongs to the workflow engine. Supports Idempotency-Key.
         */
        post: operations["submit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-requests/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Withdraw a request before a decision
         * @description Only the requester may cancel. An approved request cannot be cancelled; reversing it is a separate operation. Supports Idempotency-Key.
         */
        post: operations["cancel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/subcategories/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a subcategory */
        post: operations["setSubcategoryActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/request-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List administrative request types */
        get: operations["requestTypes"];
        put?: never;
        /** Create a request type */
        post: operations["createRequestType"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/natures": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List expense natures */
        get: operations["natures"];
        put?: never;
        /** Create an expense nature */
        post: operations["createNature"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/natures/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a nature */
        post: operations["setNatureActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List categories with their subcategories */
        get: operations["categories"];
        put?: never;
        /** Create a category */
        post: operations["createCategory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/categories/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a category */
        post: operations["setCategoryActive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-configuration/categories/{categoryId}/subcategories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add a subcategory to a category */
        post: operations["createSubcategory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/exceeding-limit-rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List exceeding-limit rules */
        get: operations["list_6"];
        put?: never;
        /**
         * Create an exceeding-limit rule
         * @description One active rule per nature, classification and currency; overlapping thresholds are refused because the outcome would otherwise depend on row order.
         */
        post: operations["create_6"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/exceeding-limit-rules/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a rule */
        post: operations["setActive_5"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/documents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload a document and attach it to an expense request */
        post: operations["upload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/delegation-matrix": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List delegation rules, optionally for one category */
        get: operations["list_7"];
        put?: never;
        /**
         * Create a delegation rule with its approval chain
         * @description Overlapping active rules for the same classification and amount are refused by a database exclusion constraint.
         */
        post: operations["create_7"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/delegation-matrix/{id}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Close a rule's effective period
         * @description The rule stops applying from now and remains readable for historical routes.
         */
        post: operations["close"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/delegation-matrix/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a rule */
        post: operations["setActive_6"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/delegation-matrix/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Preview the approval chain for a hypothetical request
         * @description Uses the same resolver as request submission, so the preview cannot disagree with what submission would do.
         */
        post: operations["preview"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/smtp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Return the active SMTP configuration (password masked) */
        get: operations["get_7"];
        put?: never;
        /** Create or replace the active SMTP configuration */
        post: operations["save"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/smtp/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send a test email; include body for pre-save validation, omit to test the saved config */
        post: operations["test_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/email-templates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all templates */
        get: operations["list_8"];
        put?: never;
        /** Create a new template (initial version v1) */
        post: operations["create_8"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/email-templates/{id}/versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List version history of a template (most recent first) */
        get: operations["history_1"];
        put?: never;
        /** Create a new immutable version of a template */
        post: operations["newVersion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/email-templates/{id}/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Preview a rendered version of the template with sample placeholder values */
        post: operations["preview_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/committees": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List committees with their levels and members */
        get: operations["list_9"];
        put?: never;
        /** Create a committee */
        post: operations["create_9"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/committees/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one committee */
        get: operations["get_8"];
        put?: never;
        /**
         * Rename a committee
         * @description The committee code is immutable: published workflows and delegation rules refer to it.
         */
        post: operations["rename"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/committees/{id}/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add a member
         * @description At most one active CEO, CFO and head of administration is permitted per committee.
         */
        post: operations["addMember"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/committees/{id}/members/{memberId}/end": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * End a membership
         * @description Refused while the member is seated on an active level, because that would silently disable an approval path.
         */
        post: operations["endMembership"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/committees/{id}/levels": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add an amount band with its seats
         * @description A band whose quorum exceeds its seats is refused: it could never approve anything.
         */
        post: operations["addLevel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/committees/{id}/levels/{levelId}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Deactivate an amount band */
        post: operations["deactivateLevel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/committees/{id}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Deactivate a committee and its levels */
        post: operations["deactivate_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/business-rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List rule sets */
        get: operations["list_10"];
        put?: never;
        /** Create a new rule set (seeds an empty DRAFT v1) */
        post: operations["create_10"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/business-rules/{id}/retire": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Retire the currently PUBLISHED version */
        post: operations["retire_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/business-rules/{id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Validate and publish the current DRAFT version, retiring the previous PUBLISHED version */
        post: operations["publish_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/business-rules/{id}/drafts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new DRAFT version if none exists */
        post: operations["newDraft"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/reset-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Set a new password using a reset token */
        post: operations["resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign out and invalidate the session */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sign in with a username and password
         * @description Establishes a server-side session and sets the JSESSIONID cookie. Returns the caller's profile, roles and effective permissions.
         */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/forgot-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request a password reset
         * @description Always returns the same message, whether or not the address is registered.
         */
        post: operations["forgotPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/change-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Change your own password
         * @description Requires the current password. Returns 200 with no body on success.
         */
        post: operations["changePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/bootstrap": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create the first administrator
         * @description Requires the one-time installation token in the X-Installation-Token header. Permanently closes once completed.
         */
        post: operations["bootstrap"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approvals/tasks/{taskId}/revert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Revert an assigned task
         * @description Returns the request for correction. Remarks are required (BRD 8.5). The destination is the revision's declared revert target, or its initial state. Supports Idempotency-Key.
         */
        post: operations["revert"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approvals/tasks/{taskId}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reject an assigned task
         * @description Ends the request unless the workflow's published revision declares another target. Remarks are required (BRD 8.5). Supports Idempotency-Key.
         */
        post: operations["reject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approvals/tasks/{taskId}/forward": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Forward an assigned task to another user
         * @description Closes the caller's task and opens an equivalent one for the recipient in the same step, so the delegate's approval counts toward the same quorum. A recipient and remarks are both required (BRD 8.5). Supports Idempotency-Key.
         */
        post: operations["forward"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approvals/tasks/{taskId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Approve an assigned task
         * @description Advances the workflow when the step's quorum is met. Remarks are required (BRD 8.5). Supports Idempotency-Key.
         */
        post: operations["approve"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approval-limits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List approval limits, optionally for one department */
        get: operations["list_11"];
        put?: never;
        /**
         * Create an approval limit
         * @description Omit userId for a department-wide limit; supply it for a personal limit. Overlapping active periods for the same authority are refused.
         */
        post: operations["create_11"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approval-limits/{id}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate or deactivate a limit */
        post: operations["setActive_7"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approval-limits/authority-check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Check who could approve an amount in a department
         * @description Read-only preview of the resolution Phase 3 will use. It does not route anything.
         */
        post: operations["checkAuthority"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/settings/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update multiple settings atomically in one transaction
         * @description All supplied keys must already exist and be editable; no partial updates.
         */
        patch: operations["bulkUpdateSettings"];
        trace?: never;
    };
    "/api/v1/workflows/{definitionId}/versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Version history of a definition, newest first */
        get: operations["versions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/versions/{versionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One revision with its steps, designations, states and transitions */
        get: operations["version"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/versions/{versionId}/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Validate a revision without publishing it
         * @description Read-only, so a designer can call it on every save. Errors block publication; warnings describe operational risks that do not make the workflow unroutable.
         */
        get: operations["validate"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflows/versions/compare": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Structural diff between two revisions
         * @description Reports added, removed and modified steps, states and transitions by code so an administrator can review exactly what a new version would change before publishing it.
         */
        get: operations["compare"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/effective-permissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Effective permission codes a user currently holds
         * @description Union of permissions from all active, non-expired roles assigned to the user. Deactivated users return an empty set. Intended for admin diagnostics and audit.
         */
        get: operations["effectivePermissions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lightweight user lookup for pickers (manager, approver) */
        get: operations["search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/themes/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The currently-active default theme */
        get: operations["activeTheme"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/system/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["info"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/settings/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a single setting by key */
        get: operations["getSetting"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/settings/categories/{category}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List active settings in a category */
        get: operations["listByCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/roles/permissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The permission catalogue, grouped by module
         * @description Read-only: permission codes are a public contract installed by migration.
         */
        get: operations["catalogue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reporting/widgets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Catalogue of supported dashboard widget keys */
        get: operations["widgetCatalogue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reporting/reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Catalogue of supported report keys */
        get: operations["reportCatalogue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reporting/expense-requests/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Expense-request register (paged)
         * @description Scoped, filtered, paged register. Default sort submittedAt desc; page size capped at 500. Free-text search matches request number and justification.
         */
        get: operations["register"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reporting/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Dashboard summary metrics
         * @description Scalar cards plus status, department, category, expense-type and daily-trend distributions, scoped to the caller. Monetary figures use base_currency_amount captured at submission; no FX re-conversion is performed.
         */
        get: operations["dashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recommending-authorities/resolved": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resolve the authority for a department and classification
         * @description The same lookup the workflow engine performs. resolution is CONFIGURED, NONE_CONFIGURED or CONFIGURED_USER_INACTIVE.
         */
        get: operations["resolved"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/public/configuration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Safe subset of branding and configuration for the login page and app shell
         * @description No authentication required. Never exposes secrets, roles or internal settings.
         */
        get: operations["publicConfiguration"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/units/tree": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The organization hierarchy as a tree
         * @description Built from the self-referencing parent relationship; depth is data, not fixed.
         */
        get: operations["tree"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organization/unit-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List the organization unit type vocabulary */
        get: operations["unitTypes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List current user's notifications */
        get: operations["list_12"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/notifications/unread-count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Unread count for the current user */
        get: operations["unreadCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List supported integration provider types */
        get: operations["providers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/executions/{execId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Execution detail */
        get: operations["executionDetail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/feature-flags/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one feature flag */
        get: operations["getFlag"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expense-requests/{id}/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Activity timeline for a request
         * @description Merges audit events (creation, updates, submission, cancellation) with workflow actions (approve, reject, revert, forward, escalate) and task assignments, in deterministic chronological order. Pagination is keyset-based: pass the opaque nextCursor from the previous response. Out-of-scope requests are reported as not found.
         */
        get: operations["timeline"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/exceeding-limit-rules/evaluation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Evaluate the configured rules against a hypothetical amount
         * @description Answers which thresholds the amount would cross. Nothing is routed and nothing is saved; the response states that no consequence is applied yet.
         */
        get: operations["evaluate"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/documents/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Metadata for one document */
        get: operations["get_9"];
        put?: never;
        post?: never;
        /** Delete a document (soft-delete DB record + best-effort remote delete) */
        delete: operations["delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/documents/{id}/scans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Malware scan history for a document */
        get: operations["scans"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/documents/{id}/download-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Issue a time-limited, signed download URL for a CLEAN document */
        get: operations["downloadUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/documents/requests/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List documents attached to an authorised expense request */
        get: operations["listForRequest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dev/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dev/me/permissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["permissions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List supported events and their routing configuration */
        get: operations["list_13"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/email-templates/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Template details (current version) */
        get: operations["get_10"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/committees/coverage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Report which band would decide an amount, and whether it can reach its quorum */
        get: operations["coverage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The authenticated caller's profile, roles, permissions and data scopes */
        get: operations["currentUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/installation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Whether this installation has been set up */
        get: operations["installationStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/csrf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtain a CSRF token
         * @description The token must be sent back in the X-XSRF-TOKEN header on every state-changing request.
         */
        get: operations["csrf"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/audit-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search audit events
         * @description Bounded paginated search. The default window is the last 24 hours; a single request may span at most 31 days. List rows do not include before/after values; retrieve a single event for the diff.
         */
        get: operations["search_1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/audit-events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One audit event with its redacted before/after diff
         * @description For events concerning an expense request, the caller must also be able to read that request (audit:view alone does not let an auditor read another user's request detail).
         */
        get: operations["get_11"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approvals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * My pending approvals
         * @description Open tasks addressed to the caller directly or to a role they currently hold, newest first. A role-addressed task is visible to every current holder, and acting on it is still recorded against the individual who acted.
         */
        get: operations["inbox"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approvals/tasks/{taskId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The case file for one approval task
         * @description The request, the workflow's position, per-step progress and the decision history. Also reports which actions the caller may take and why not, so a UI can render the panel from the server's decision rather than re-deriving the rules.
         */
        get: operations["caseFile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approvals/tasks/{taskId}/request": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The expense request behind an approval task
         * @description Read-only, and scoped by the Phase 2 visibility rules: an approver sees the request they were assigned, not every request.
         */
        get: operations["requestFor"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/approvals/count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** How many approvals await the caller */
        get: operations["count"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/scopes/{scopeId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove a data scope */
        delete: operations["removeScope"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/roles/{assignmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Revoke a role assignment */
        delete: operations["revokeRole"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/communication/smtp/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Deactivate the currently-active SMTP configuration and clear in-memory credentials */
        delete: operations["deactivate_2"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/business-rules/rules/{ruleId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete a rule from a DRAFT version */
        delete: operations["deleteRule"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        SaveDefinitionRequest: {
            code: string;
            name: string;
            description?: string;
            /** Format: uuid */
            requestTypeId?: string;
        };
        ApiResponseDefinitionResponse: {
            success?: boolean;
            data?: components["schemas"]["DefinitionResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        DefinitionResponse: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            description?: string;
            /** Format: uuid */
            requestTypeId?: string;
            active?: boolean;
            /** Format: uuid */
            publishedVersionId?: string;
            /** Format: int32 */
            publishedVersionNumber?: number;
            /** Format: int32 */
            draftVersionCount?: number;
            versions?: components["schemas"]["VersionSummary"][];
        };
        ErrorBody: {
            code?: string;
            message?: string;
        };
        FieldErrorDetail: {
            field?: string;
            message?: string;
        };
        VersionSummary: {
            /** Format: uuid */
            id?: string;
            /** Format: int32 */
            versionNumber?: number;
            status?: string;
            /** Format: date-time */
            publishedAt?: string;
            /** Format: uuid */
            publishedBy?: string;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            retiredAt?: string;
            /** Format: uuid */
            supersededByVersionId?: string;
        };
        ApproverRequest: {
            /** @enum {string} */
            approverType: "ROLE" | "USER" | "DEPARTMENT_HEAD" | "RECOMMENDING_AUTHORITY" | "EXPENSE_COMMITTEE" | "CEO" | "CFO" | "HEAD_OF_ADMIN_GSD" | "MANAGER";
            /** Format: uuid */
            roleId?: string;
            /** Format: uuid */
            userId?: string;
            /** Format: uuid */
            committeeLevelId?: string;
        };
        SaveDraftRequest: {
            steps: components["schemas"]["StepRequest"][];
            transitions?: components["schemas"]["TransitionRequest"][];
            states?: components["schemas"]["StateRequest"][];
        };
        StateRequest: {
            stateCode: string;
            stateName: string;
            /** @enum {string} */
            stateType: "INITIAL" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | "CANCELLED" | "REVERSED";
        };
        StepRequest: {
            stepCode: string;
            stepName: string;
            /** Format: int32 */
            stepOrder?: number;
            /** @enum {string} */
            approvalMode: "SEQUENTIAL" | "PARALLEL";
            /** Format: int32 */
            minimumApprovals?: number;
            approvers: components["schemas"]["ApproverRequest"][];
        };
        TransitionRequest: {
            fromStateCode: string;
            toStateCode?: string;
            /** @enum {string} */
            actionCode: "SUBMIT" | "APPROVE" | "REJECT" | "REVERT" | "FORWARD" | "CANCEL" | "REVERSE" | "ESCALATE";
            /** Format: uuid */
            conditionRuleId?: string;
        };
        ApiResponseVersionResponse: {
            success?: boolean;
            data?: components["schemas"]["VersionResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApproverResponse: {
            /** Format: uuid */
            id?: string;
            approverType?: string;
            /** Format: uuid */
            roleId?: string;
            /** Format: uuid */
            userId?: string;
            /** Format: uuid */
            committeeLevelId?: string;
        };
        StateResponse: {
            /** Format: uuid */
            id?: string;
            stateCode?: string;
            stateName?: string;
            stateType?: string;
            initial?: boolean;
            terminal?: boolean;
        };
        StepResponse: {
            /** Format: uuid */
            id?: string;
            stepCode?: string;
            stepName?: string;
            /** Format: int32 */
            stepOrder?: number;
            approvalMode?: string;
            /** Format: int32 */
            minimumApprovals?: number;
            mandatory?: boolean;
            approvers?: components["schemas"]["ApproverResponse"][];
        };
        TransitionResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            fromStateId?: string;
            /** Format: uuid */
            toStateId?: string;
            actionCode?: string;
            /** Format: uuid */
            conditionRuleId?: string;
        };
        VersionResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            definitionId?: string;
            /** Format: int32 */
            versionNumber?: number;
            status?: string;
            /** Format: date-time */
            publishedAt?: string;
            /** Format: uuid */
            publishedBy?: string;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            retiredAt?: string;
            /** Format: uuid */
            retiredBy?: string;
            /** Format: uuid */
            supersededByVersionId?: string;
            steps?: components["schemas"]["StepResponse"][];
            states?: components["schemas"]["StateResponse"][];
            transitions?: components["schemas"]["TransitionResponse"][];
        };
        UpdateUserRequest: {
            firstName: string;
            lastName: string;
            /** Format: email */
            email: string;
            employeeCode?: string;
            designation?: string;
            /** Format: uuid */
            departmentId?: string;
            /** Format: uuid */
            branchId?: string;
            /** Format: uuid */
            managerId?: string;
        };
        ApiResponseUserResponse: {
            success?: boolean;
            data?: components["schemas"]["UserResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        UserResponse: {
            /** Format: uuid */
            id?: string;
            username?: string;
            employeeCode?: string;
            firstName?: string;
            lastName?: string;
            displayName?: string;
            email?: string;
            designation?: string;
            /** Format: uuid */
            departmentId?: string;
            departmentName?: string;
            /** Format: uuid */
            branchId?: string;
            branchName?: string;
            /** Format: uuid */
            managerId?: string;
            managerName?: string;
            active?: boolean;
            /** Format: date-time */
            lastLoginAt?: string;
            /** Format: date-time */
            createdAt?: string;
            roles?: components["schemas"]["UserRoleView"][];
            scopes?: components["schemas"]["UserScopeView"][];
        };
        UserRoleView: {
            /** Format: uuid */
            assignmentId?: string;
            /** Format: uuid */
            roleId?: string;
            roleCode?: string;
            roleName?: string;
            /** Format: date-time */
            assignedAt?: string;
            /** Format: date-time */
            expiresAt?: string;
            live?: boolean;
        };
        UserScopeView: {
            /** Format: uuid */
            id?: string;
            scopeType?: string;
            /** Format: uuid */
            referenceId?: string;
            referenceName?: string;
        };
        SaveThemeRequest: {
            name: string;
            description?: string;
            /** @enum {string} */
            themeType: "LIGHT" | "DARK";
            primaryColor?: string;
            secondaryColor?: string;
            accentColor?: string;
            backgroundColor?: string;
            surfaceColor?: string;
            textColor?: string;
            headingColor?: string;
            navBgColor?: string;
            navTextColor?: string;
            buttonPrimaryColor?: string;
            buttonPrimaryText?: string;
            successColor?: string;
            warningColor?: string;
            errorColor?: string;
            infoColor?: string;
            tokens?: components["schemas"]["ThemeTokenRequest"][];
        };
        ThemeTokenRequest: {
            key: string;
            value: string;
            /** @enum {string} */
            type: "COLOUR" | "FONT" | "SPACING" | "RADIUS" | "OTHER";
        };
        ApiResponseThemeResponse: {
            success?: boolean;
            data?: components["schemas"]["ThemeResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ThemeResponse: {
            /** Format: uuid */
            id?: string;
            name?: string;
            description?: string;
            themeType?: string;
            active?: boolean;
            isDefault?: boolean;
            primaryColor?: string;
            secondaryColor?: string;
            accentColor?: string;
            backgroundColor?: string;
            surfaceColor?: string;
            textColor?: string;
            headingColor?: string;
            navBgColor?: string;
            navTextColor?: string;
            buttonPrimaryColor?: string;
            buttonPrimaryText?: string;
            successColor?: string;
            warningColor?: string;
            errorColor?: string;
            infoColor?: string;
            tokens?: {
                [key: string]: string;
            };
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        SaveRoleRequest: {
            name: string;
            code: string;
            description?: string;
        };
        ApiResponseRoleResponse: {
            success?: boolean;
            data?: components["schemas"]["RoleResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        PermissionView: {
            /** Format: uuid */
            id?: string;
            code?: string;
            module?: string;
            description?: string;
        };
        RoleResponse: {
            /** Format: uuid */
            id?: string;
            name?: string;
            code?: string;
            description?: string;
            systemRole?: boolean;
            active?: boolean;
            permissions?: components["schemas"]["PermissionView"][];
            /** Format: int64 */
            activeUserCount?: number;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        SetPermissionsRequest: {
            permissionCodes: string[];
        };
        SaveRecommendingAuthorityRequest: {
            /** Format: uuid */
            departmentId: string;
            /** Format: uuid */
            userId: string;
            /** @enum {string} */
            expenseType: "OPEX" | "CAPEX" | "BOTH";
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
        };
        ApiResponseRecommendingAuthorityResponse: {
            success?: boolean;
            data?: components["schemas"]["RecommendingAuthorityResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        RecommendingAuthorityResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            departmentId?: string;
            departmentName?: string;
            /** Format: uuid */
            userId?: string;
            userDisplayName?: string;
            expenseType?: string;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
            active?: boolean;
        };
        UpdateOrganizationUnitRequest: {
            code?: string;
            name?: string;
            description?: string;
            /** Format: uuid */
            parentUnitId?: string;
        };
        ApiResponseOrganizationUnitResponse: {
            success?: boolean;
            data?: components["schemas"]["OrganizationUnitResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        OrganizationUnitResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            parentUnitId?: string;
            /** Format: uuid */
            unitTypeId?: string;
            unitTypeCode?: string;
            unitTypeName?: string;
            code?: string;
            name?: string;
            description?: string;
            active?: boolean;
            /** Format: int32 */
            depth?: number;
        };
        SaveDepartmentRequest: {
            code: string;
            name: string;
            description?: string;
            /** Format: uuid */
            parentUnitId?: string;
            /** Format: uuid */
            headUserId?: string;
        };
        ApiResponseDepartmentResponse: {
            success?: boolean;
            data?: components["schemas"]["DepartmentResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        DepartmentResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            unitId?: string;
            code?: string;
            name?: string;
            /** Format: uuid */
            headUserId?: string;
            headName?: string;
            active?: boolean;
        };
        SaveBranchRequest: {
            code: string;
            name: string;
            description?: string;
            /** Format: uuid */
            parentUnitId?: string;
            address?: string;
        };
        ApiResponseBranchResponse: {
            success?: boolean;
            data?: components["schemas"]["BranchResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        BranchResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            unitId?: string;
            code?: string;
            name?: string;
            address?: string;
            active?: boolean;
        };
        SaveVendorRequest: {
            code: string;
            name: string;
            taxNumber?: string;
            contactPerson?: string;
            /** Format: email */
            email?: string;
            phone?: string;
            address?: string;
        };
        ApiResponseVendorResponse: {
            success?: boolean;
            data?: components["schemas"]["VendorResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        VendorResponse: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            taxNumber?: string;
            contactPerson?: string;
            email?: string;
            phone?: string;
            address?: string;
            active?: boolean;
        };
        SaveTaxAuthorityRequest: {
            code: string;
            name: string;
            description?: string;
        };
        ApiResponseTaxAuthorityResponse: {
            success?: boolean;
            data?: components["schemas"]["TaxAuthorityResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        TaxAuthorityResponse: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            description?: string;
            active?: boolean;
        };
        SaveCurrencyRequest: {
            code: string;
            name: string;
            symbol?: string;
            /** Format: int32 */
            decimalPlaces?: number;
        };
        ApiResponseCurrencyResponse: {
            success?: boolean;
            data?: components["schemas"]["CurrencyResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        CurrencyResponse: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            symbol?: string;
            /** Format: int32 */
            decimalPlaces?: number;
            active?: boolean;
        };
        UpdateIntegrationRequest: {
            name?: string;
            description?: string;
            endpointUrl?: string;
            /** @enum {string} */
            authMode?: "NONE" | "BASIC" | "BEARER" | "API_KEY" | "OAUTH2" | "CLIENT_CERTIFICATE" | "LDAP_BIND";
            username?: string;
            secret?: string;
            /** @enum {string} */
            secretAction?: "SET" | "CLEAR" | "KEEP";
            configuration?: {
                [key: string]: unknown;
            };
            /** Format: int64 */
            expectedVersion?: number;
        };
        ApiResponseIntegrationDetail: {
            success?: boolean;
            data?: components["schemas"]["IntegrationDetail"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        IntegrationDetail: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            providerType?: string;
            description?: string;
            endpointUrl?: string;
            /** @enum {string} */
            authMode?: "NONE" | "BASIC" | "BEARER" | "API_KEY" | "OAUTH2" | "CLIENT_CERTIFICATE" | "LDAP_BIND";
            username?: string;
            configuration?: {
                [key: string]: unknown;
            };
            active?: boolean;
            archived?: boolean;
            /** @enum {string} */
            connectionStatus?: "UNKNOWN" | "UNCONFIGURED" | "ACTIVE" | "INACTIVE" | "FAILED" | "TESTING";
            /** Format: date-time */
            lastTestAt?: string;
            lastTestSuccess?: boolean;
            lastTestMessage?: string;
            /** Format: int32 */
            lastTestDurationMs?: number;
            /** Format: date-time */
            connectionCheckedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            createdBy?: string;
            /** Format: date-time */
            updatedAt?: string;
            updatedBy?: string;
            /** Format: int64 */
            version?: number;
            hasSecret?: boolean;
            /** Format: int32 */
            secretVersion?: number;
        };
        AllocationPayload: {
            /** Format: uuid */
            departmentId: string;
            /** Format: uuid */
            branchId?: string;
            costCenter?: string;
            allocationAmount: number;
            allocationPercentage?: number;
        };
        BudgetSummaryPayload: {
            budgetReference: string;
            allocatedAmount: number;
            consumedAmount: number;
        };
        CapexDetailPayload: {
            requestType?: string;
            invoiceTotal?: number;
            approvalAmount?: number;
            totalCharges?: number;
            budgeted?: boolean;
            budgetAmount?: number;
            unbudgetedReason?: string;
            overBudgetReason?: string;
            classification?: string;
            /** Format: date */
            warrantyStartDate?: string;
            /** Format: date */
            warrantyEndDate?: string;
            purchaseNature?: string;
            financeComment?: string;
            budgetComment?: string;
            termsAndConditions?: string;
        };
        InvoicePayload: {
            invoiceNumber: string;
            /** Format: date */
            invoiceDate: string;
            invoiceAmount: number;
            /** Format: uuid */
            currencyId: string;
            /** Format: uuid */
            vendorId?: string;
            /** Format: uuid */
            mediaAssetId?: string;
        };
        ItemPayload: {
            itemDescription: string;
            quantity: number;
            unitPrice: number;
            /** Format: date */
            warrantyDate?: string;
        };
        OpexDetailPayload: {
            recurring: boolean;
            recurrenceFrequency?: string;
            nonRecurringJustification?: string;
            accruedAmount?: number;
            previouslyApprovedAmount?: number;
            ytdAmount?: number;
            mtdAmount?: number;
            paymentTerms?: string;
            budgetAvailable?: number;
            budgetReference?: string;
            threeQuotationsSelected?: boolean;
            alreadyApproved?: boolean;
            taxExempt?: boolean;
            grnRequired?: boolean;
        };
        PreviousSummaryPayload: {
            period: string;
            previousAmount?: number;
            approvedAmount?: number;
            description?: string;
        };
        QuotationPayload: {
            /** Format: uuid */
            vendorId?: string;
            quotationNumber: string;
            /** Format: date */
            quotationDate: string;
            quotationAmount: number;
            /** Format: uuid */
            currencyId: string;
            /** Format: uuid */
            mediaAssetId?: string;
        };
        StaPayload: {
            /** Format: uuid */
            taxAuthorityId: string;
            staReference?: string;
            taxAmount: number;
            description?: string;
        };
        UpdateRequest: {
            /** Format: uuid */
            requestTypeId: string;
            /** Format: uuid */
            expenseCategoryId: string;
            /** Format: uuid */
            expenseSubcategoryId?: string;
            /** Format: uuid */
            expenseNatureId: string;
            /** Format: uuid */
            branchId?: string;
            /** Format: uuid */
            currencyId: string;
            requestedAmount: number;
            justification?: string;
            opex?: components["schemas"]["OpexDetailPayload"];
            capex?: components["schemas"]["CapexDetailPayload"];
            allocations?: components["schemas"]["AllocationPayload"][];
            items?: components["schemas"]["ItemPayload"][];
            quotations?: components["schemas"]["QuotationPayload"][];
            invoices?: components["schemas"]["InvoicePayload"][];
            previousSummaries?: components["schemas"]["PreviousSummaryPayload"][];
            staDetails?: components["schemas"]["StaPayload"][];
            budgetSummaries?: components["schemas"]["BudgetSummaryPayload"][];
        };
        AllocationResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            departmentId?: string;
            /** Format: uuid */
            branchId?: string;
            costCenter?: string;
            allocationAmount?: number;
            allocationPercentage?: number;
        };
        ApiResponseRequestResponse: {
            success?: boolean;
            data?: components["schemas"]["RequestResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        BudgetSummaryResponse: {
            /** Format: uuid */
            id?: string;
            budgetReference?: string;
            allocatedAmount?: number;
            consumedAmount?: number;
            availableAmount?: number;
        };
        CapexDetailResponse: {
            /** Format: uuid */
            id?: string;
            requestType?: string;
            /** Format: uuid */
            staId?: string;
            invoiceTotal?: number;
            approvalAmount?: number;
            totalCharges?: number;
            budgeted?: boolean;
            budgetAmount?: number;
            unbudgetedReason?: string;
            overBudgetReason?: string;
            classification?: string;
            /** Format: date */
            warrantyStartDate?: string;
            /** Format: date */
            warrantyEndDate?: string;
        };
        InvoiceResponse: {
            /** Format: uuid */
            id?: string;
            invoiceNumber?: string;
            /** Format: date */
            invoiceDate?: string;
            invoiceAmount?: number;
            /** Format: uuid */
            currencyId?: string;
            /** Format: uuid */
            vendorId?: string;
            /** Format: uuid */
            mediaAssetId?: string;
        };
        ItemResponse: {
            /** Format: uuid */
            id?: string;
            itemDescription?: string;
            quantity?: number;
            unitPrice?: number;
            totalAmount?: number;
            /** Format: date */
            warrantyDate?: string;
        };
        OpexDetailResponse: {
            /** Format: uuid */
            id?: string;
            recurring?: boolean;
            recurrenceFrequency?: string;
            nonRecurringJustification?: string;
            accruedAmount?: number;
            previouslyApprovedAmount?: number;
            ytdAmount?: number;
            mtdAmount?: number;
            paymentTerms?: string;
            budgetAvailable?: number;
            budgetReference?: string;
        };
        PreviousSummaryResponse: {
            /** Format: uuid */
            id?: string;
            period?: string;
            previousAmount?: number;
            approvedAmount?: number;
            description?: string;
        };
        QuotationResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            vendorId?: string;
            quotationNumber?: string;
            /** Format: date */
            quotationDate?: string;
            quotationAmount?: number;
            /** Format: uuid */
            currencyId?: string;
            /** Format: uuid */
            mediaAssetId?: string;
        };
        RequestResponse: {
            /** Format: uuid */
            id?: string;
            requestNumber?: string;
            status?: string;
            classification?: string;
            /** Format: uuid */
            requestTypeId?: string;
            /** Format: uuid */
            expenseCategoryId?: string;
            /** Format: uuid */
            expenseSubcategoryId?: string;
            /** Format: uuid */
            expenseNatureId?: string;
            /** Format: uuid */
            requestedBy?: string;
            /** Format: uuid */
            departmentId?: string;
            /** Format: uuid */
            branchId?: string;
            /** Format: uuid */
            currencyId?: string;
            requestedAmount?: number;
            baseCurrencyAmount?: number;
            /** Format: uuid */
            exchangeRateId?: string;
            justification?: string;
            /** Format: uuid */
            workflowInstanceId?: string;
            /** Format: date-time */
            submittedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            /** Format: int64 */
            version?: number;
            canEdit?: boolean;
            canSubmit?: boolean;
            canCancel?: boolean;
            terminal?: boolean;
            opex?: components["schemas"]["OpexDetailResponse"];
            capex?: components["schemas"]["CapexDetailResponse"];
            allocations?: components["schemas"]["AllocationResponse"][];
            items?: components["schemas"]["ItemResponse"][];
            quotations?: components["schemas"]["QuotationResponse"][];
            invoices?: components["schemas"]["InvoiceResponse"][];
            previousSummaries?: components["schemas"]["PreviousSummaryResponse"][];
            staDetails?: components["schemas"]["StaResponse"][];
            budgetSummaries?: components["schemas"]["BudgetSummaryResponse"][];
        };
        StaResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            taxAuthorityId?: string;
            staReference?: string;
            taxAmount?: number;
            description?: string;
        };
        SaveSubcategoryRequest: {
            code: string;
            name: string;
            description?: string;
        };
        ApiResponseSubcategoryResponse: {
            success?: boolean;
            data?: components["schemas"]["SubcategoryResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        SubcategoryResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            categoryId?: string;
            code?: string;
            name?: string;
            description?: string;
            active?: boolean;
        };
        SaveCategoryRequest: {
            code: string;
            name: string;
            description?: string;
            /** @enum {string} */
            expenseType: "OPEX" | "CAPEX" | "BOTH";
        };
        ApiResponseCategoryResponse: {
            success?: boolean;
            data?: components["schemas"]["CategoryResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        CategoryResponse: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            description?: string;
            /** @enum {string} */
            expenseType?: "OPEX" | "CAPEX" | "BOTH";
            active?: boolean;
            subcategories?: components["schemas"]["SubcategoryResponse"][];
        };
        SaveExceedingLimitRuleRequest: {
            /** @enum {string} */
            expenseType: "OPEX" | "CAPEX" | "BOTH";
            /** Format: uuid */
            natureId: string;
            /** Format: uuid */
            currencyId: string;
            thresholdAmount: number;
            /** @enum {string} */
            escalationType: "NONE" | "ADD_CEO_APPROVAL" | "NOTIFY_CFO" | "BLOCK";
        };
        ApiResponseExceedingLimitRuleResponse: {
            success?: boolean;
            data?: components["schemas"]["ExceedingLimitRuleResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ExceedingLimitRuleResponse: {
            /** Format: uuid */
            id?: string;
            expenseType?: string;
            /** Format: uuid */
            natureId?: string;
            natureName?: string;
            /** Format: uuid */
            currencyId?: string;
            thresholdAmount?: number;
            escalationType?: string;
            active?: boolean;
            enforced?: boolean;
            enforcementNote?: string;
        };
        EventConfigRequest: {
            emailEnabled: boolean;
            inAppEnabled: boolean;
            /** Format: uuid */
            emailTemplateId?: string;
            recipientGroups: string[];
            active: boolean;
        };
        ApiResponseEventConfigResponse: {
            success?: boolean;
            data?: components["schemas"]["EventConfigResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        EventConfigResponse: {
            /** Format: uuid */
            id?: string;
            eventCode?: string;
            eventDescription?: string;
            mandatory?: boolean;
            emailEnabled?: boolean;
            inAppEnabled?: boolean;
            /** Format: uuid */
            emailTemplateId?: string;
            recipientGroups?: string[];
            active?: boolean;
        };
        ApiResponseTemplateResponse: {
            success?: boolean;
            data?: components["schemas"]["TemplateResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        TemplateResponse: {
            /** Format: uuid */
            id?: string;
            code?: string;
            displayName?: string;
            description?: string;
            eventCode?: string;
            subject?: string;
            htmlBody?: string;
            textBody?: string;
            locale?: string;
            active?: boolean;
            /** Format: int32 */
            currentVersion?: number;
            allowedPlaceholders?: string[];
            /** Format: uuid */
            createdBy?: string;
            /** Format: uuid */
            updatedBy?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        UpdateRuleSetRequest: {
            name?: string;
            module?: string;
            description?: string;
            active?: boolean;
        };
        ApiResponseRuleSetSummary: {
            success?: boolean;
            data?: components["schemas"]["RuleSetSummary"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        RuleSetSummary: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            module?: string;
            description?: string;
            active?: boolean;
            /** Format: int32 */
            publishedVersion?: number;
            /** Format: int32 */
            draftVersion?: number;
        };
        RuleUpsertRequest: {
            /** Format: uuid */
            id?: string;
            code: string;
            name: string;
            condition?: {
                [key: string]: unknown;
            };
            action?: {
                [key: string]: unknown;
            };
            /** Format: int32 */
            priority?: number;
            active?: boolean;
        };
        ApiResponseRuleDetail: {
            success?: boolean;
            data?: components["schemas"]["RuleDetail"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        RuleDetail: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            condition?: {
                [key: string]: unknown;
            };
            action?: {
                [key: string]: unknown;
            };
            /** Format: int32 */
            priority?: number;
            active?: boolean;
        };
        SaveApprovalLimitRequest: {
            /** Format: uuid */
            departmentId: string;
            /** Format: uuid */
            userId?: string;
            /** @enum {string} */
            expenseType: "OPEX" | "CAPEX" | "BOTH";
            /** Format: uuid */
            currencyId: string;
            approvalLimit: number;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
        };
        ApiResponseApprovalLimitResponse: {
            success?: boolean;
            data?: components["schemas"]["ApprovalLimitResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApprovalLimitResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            departmentId?: string;
            departmentName?: string;
            /** Format: uuid */
            userId?: string;
            userDisplayName?: string;
            expenseType?: string;
            /** Format: uuid */
            currencyId?: string;
            approvalLimit?: number;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
            active?: boolean;
        };
        RetireRequest: {
            reason?: string;
        };
        PublishRequest: {
            /** Format: date-time */
            effectiveFrom?: string;
        };
        CreateUserRequest: {
            username: string;
            firstName: string;
            lastName: string;
            /** Format: email */
            email: string;
            employeeCode?: string;
            designation?: string;
            /** Format: uuid */
            departmentId?: string;
            /** Format: uuid */
            branchId?: string;
            /** Format: uuid */
            managerId?: string;
            roleIds?: string[];
        };
        ApiResponseUserCreatedResponse: {
            success?: boolean;
            data?: components["schemas"]["UserCreatedResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        UserCreatedResponse: {
            user?: components["schemas"]["UserResponse"];
            credentialSetupIssued?: boolean;
            credentialSetupNote?: string;
        };
        AssignScopeRequest: {
            scopeType: string;
            /** Format: uuid */
            referenceId?: string;
        };
        ApiResponseUserScopeView: {
            success?: boolean;
            data?: components["schemas"]["UserScopeView"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        AssignRoleRequest: {
            /** Format: uuid */
            roleId: string;
            /** Format: date-time */
            expiresAt?: string;
        };
        ApiResponseUserRoleView: {
            success?: boolean;
            data?: components["schemas"]["UserRoleView"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseVoid: {
            success?: boolean;
            data?: unknown;
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        SaveSettingRequest: {
            key: string;
            displayName?: string;
            description?: string;
            category: string;
            /** @enum {string} */
            type: "STRING" | "BOOLEAN" | "INTEGER" | "DECIMAL" | "JSON" | "DATE";
            value?: unknown;
            defaultValue?: unknown;
            active?: boolean;
            editable?: boolean;
        };
        ApiResponseSettingResponse: {
            success?: boolean;
            data?: components["schemas"]["SettingResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        SettingResponse: {
            /** Format: uuid */
            id?: string;
            key?: string;
            displayName?: string;
            description?: string;
            category?: string;
            type?: string;
            value?: unknown;
            defaultValue?: unknown;
            active?: boolean;
            editable?: boolean;
            /** Format: date-time */
            updatedAt?: string;
        };
        ExportRequest: {
            reportKey?: string;
            filter?: components["schemas"]["ReportFilter"];
            /** @enum {string} */
            format?: "CSV" | "EXCEL";
        };
        ReportFilter: {
            /** Format: uuid */
            departmentId?: string;
            /** Format: uuid */
            branchId?: string;
            /** Format: uuid */
            categoryId?: string;
            /** Format: uuid */
            subcategoryId?: string;
            /** Format: uuid */
            requesterId?: string;
            expenseType?: string;
            /** @enum {string} */
            status?: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "RETURNED" | "APPROVED" | "REJECTED" | "CANCELLED" | "REVERSED";
            /** Format: date-time */
            from?: string;
            /** Format: date-time */
            to?: string;
            currency?: string;
            search?: string;
            rangeValid?: boolean;
        };
        CreateOrganizationUnitRequest: {
            code: string;
            name: string;
            description?: string;
            /** Format: uuid */
            unitTypeId?: string;
            /** Format: uuid */
            parentUnitId?: string;
        };
        /** @description Creates the singleton organization profile. Fails if a profile already exists. */
        CreateOrganizationProfileRequest: {
            organizationName: string;
            displayName?: string;
            legalName?: string;
            organizationCode?: string;
            /** Format: email */
            contactEmail?: string;
            contactPhone?: string;
            website?: string;
            /** Format: email */
            supportEmail?: string;
            addressLine1?: string;
            addressLine2?: string;
            addressCity?: string;
            addressState?: string;
            addressPostalCode?: string;
            addressCountry?: string;
            /** Format: uuid */
            logoAssetId?: string;
            /** Format: uuid */
            faviconAssetId?: string;
            timezone?: string;
            dateFormat?: string;
            /** Format: uuid */
            defaultCurrencyId?: string;
        };
        ApiResponseOrganizationProfileResponse: {
            success?: boolean;
            data?: components["schemas"]["OrganizationProfileResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        /** @description The installation's own identity and contact details */
        OrganizationProfileResponse: {
            /** Format: uuid */
            id?: string;
            organizationName?: string;
            displayName?: string;
            legalName?: string;
            organizationCode?: string;
            contactEmail?: string;
            contactPhone?: string;
            website?: string;
            supportEmail?: string;
            addressLine1?: string;
            addressLine2?: string;
            addressCity?: string;
            addressState?: string;
            addressPostalCode?: string;
            addressCountry?: string;
            /** Format: uuid */
            logoAssetId?: string;
            /** Format: uuid */
            faviconAssetId?: string;
            timezone?: string;
            dateFormat?: string;
            /** Format: uuid */
            defaultCurrencyId?: string;
            defaultCurrencyCode?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        ApiResponseMapStringInteger: {
            success?: boolean;
            data?: {
                [key: string]: number;
            };
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        SaveExchangeRateRequest: {
            /** Format: uuid */
            fromCurrencyId: string;
            /** Format: uuid */
            toCurrencyId: string;
            /** @description Rate to multiply an amount in the source currency by */
            rate: number;
            /**
             * Format: date-time
             * @description Start of the period; defaults to now when omitted
             */
            effectiveFrom?: string;
            /**
             * Format: date-time
             * @description End of the period; null means the rate is currently in force
             */
            effectiveTo?: string;
        };
        ApiResponseExchangeRateResponse: {
            success?: boolean;
            data?: components["schemas"]["ExchangeRateResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ExchangeRateResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            fromCurrencyId?: string;
            fromCurrencyCode?: string;
            /** Format: uuid */
            toCurrencyId?: string;
            toCurrencyCode?: string;
            rate?: number;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        CloseExchangeRateRequest: {
            /**
             * Format: date-time
             * @description Instant at which to close the rate period; defaults to now when omitted
             */
            endAt?: string;
        };
        CreateIntegrationRequest: {
            code?: string;
            name?: string;
            providerType?: string;
            description?: string;
            endpointUrl?: string;
            /** @enum {string} */
            authMode?: "NONE" | "BASIC" | "BEARER" | "API_KEY" | "OAUTH2" | "CLIENT_CERTIFICATE" | "LDAP_BIND";
            username?: string;
            secret?: string;
            /** @enum {string} */
            secretAction?: "SET" | "CLEAR" | "KEEP";
            configuration?: {
                [key: string]: unknown;
            };
        };
        ApiResponseConnectionTestResponse: {
            success?: boolean;
            data?: components["schemas"]["ConnectionTestResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ConnectionTestResponse: {
            success?: boolean;
            /** @enum {string} */
            resultingState?: "UNKNOWN" | "UNCONFIGURED" | "ACTIVE" | "INACTIVE" | "FAILED" | "TESTING";
            message?: string;
            /** Format: int32 */
            respondedInMs?: number;
            diagnosticCode?: string;
            /** Format: date-time */
            testedAt?: string;
        };
        ExecuteRequest: {
            operation?: string;
            idempotencyKey?: string;
            requestMetadata?: {
                [key: string]: unknown;
            };
        };
        ApiResponseExecutionSummary: {
            success?: boolean;
            data?: components["schemas"]["ExecutionSummary"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ExecutionSummary: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            integrationConfigId?: string;
            operation?: string;
            idempotencyKey?: string;
            externalReference?: string;
            /** @enum {string} */
            status?: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "RETRY_PENDING" | "CANCELLED";
            /** Format: int32 */
            attemptCount?: number;
            /** Format: int32 */
            maxAttempts?: number;
            /** Format: date-time */
            startedAt?: string;
            /** Format: date-time */
            completedAt?: string;
            /** Format: date-time */
            nextRetryAt?: string;
            retryable?: boolean;
            errorCode?: string;
            errorMessage?: string;
            /** Format: uuid */
            triggeredBy?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            /** Format: int64 */
            version?: number;
        };
        RetryRequest: {
            /** Format: int64 */
            expectedVersion?: number;
        };
        SaveFeatureFlagRequest: {
            key: string;
            displayName: string;
            description?: string;
            enabled?: boolean;
            configuration?: unknown;
        };
        ApiResponseFeatureFlagResponse: {
            success?: boolean;
            data?: components["schemas"]["FeatureFlagResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        FeatureFlagResponse: {
            /** Format: uuid */
            id?: string;
            key?: string;
            displayName?: string;
            description?: string;
            enabled?: boolean;
            configuration?: unknown;
            /** Format: date-time */
            updatedAt?: string;
        };
        CreateRequest: {
            /** Format: uuid */
            requestTypeId: string;
            /** Format: uuid */
            expenseCategoryId: string;
            /** Format: uuid */
            expenseSubcategoryId?: string;
            /** Format: uuid */
            expenseNatureId: string;
            /** Format: uuid */
            departmentId: string;
            /** Format: uuid */
            branchId?: string;
            /** Format: uuid */
            currencyId: string;
            requestedAmount: number;
            justification?: string;
            opex?: components["schemas"]["OpexDetailPayload"];
            capex?: components["schemas"]["CapexDetailPayload"];
            allocations?: components["schemas"]["AllocationPayload"][];
            items?: components["schemas"]["ItemPayload"][];
            quotations?: components["schemas"]["QuotationPayload"][];
            invoices?: components["schemas"]["InvoicePayload"][];
            previousSummaries?: components["schemas"]["PreviousSummaryPayload"][];
            staDetails?: components["schemas"]["StaPayload"][];
            budgetSummaries?: components["schemas"]["BudgetSummaryPayload"][];
            documents?: components["schemas"]["DocumentReferencePayload"][];
        };
        DocumentReferencePayload: {
            /** Format: uuid */
            mediaAssetId: string;
            documentType: string;
            mandatory?: boolean;
        };
        CancelRequest: {
            reason: string;
        };
        SaveLookupRequest: {
            code: string;
            name: string;
            description?: string;
        };
        ApiResponseLookupResponse: {
            success?: boolean;
            data?: components["schemas"]["LookupResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        /** @description A code/name pair from a configurable vocabulary */
        LookupResponse: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            description?: string;
            active?: boolean;
        };
        ApiResponseDocumentResponse: {
            success?: boolean;
            data?: components["schemas"]["DocumentResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        /** @description Metadata for a stored document; binary content is served via the download endpoint. */
        DocumentResponse: {
            /** Format: uuid */
            id?: string;
            originalFilename?: string;
            category?: string;
            mimeType?: string;
            /** Format: int64 */
            sizeBytes?: number;
            description?: string;
            lifecycleStatus?: string;
            scanStatus?: string;
            /** Format: uuid */
            uploadedBy?: string;
            uploadedByName?: string;
            /** Format: date-time */
            uploadedAt?: string;
            /** Format: uuid */
            expenseRequestId?: string;
        };
        SaveApproverStepRequest: {
            approverType: string;
            /** Format: uuid */
            requiredRoleId?: string;
            departmentScope?: string;
            mandatory?: boolean;
        };
        SaveDelegationRuleRequest: {
            /** Format: uuid */
            categoryId: string;
            /** Format: uuid */
            subcategoryId?: string;
            /** Format: uuid */
            natureId: string;
            /** Format: uuid */
            requestTypeId?: string;
            minimumAmount?: number;
            maximumAmount?: number;
            /** Format: uuid */
            currencyId: string;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
            steps: components["schemas"]["SaveApproverStepRequest"][];
        };
        ApiResponseDelegationRuleResponse: {
            success?: boolean;
            data?: components["schemas"]["DelegationRuleResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApproverStepResponse: {
            /** Format: int32 */
            stepOrder?: number;
            approverType?: string;
            /** Format: uuid */
            requiredRoleId?: string;
            roleCode?: string;
            departmentScope?: string;
            mandatory?: boolean;
        };
        DelegationRuleResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            categoryId?: string;
            categoryName?: string;
            /** Format: uuid */
            subcategoryId?: string;
            subcategoryName?: string;
            /** Format: uuid */
            natureId?: string;
            natureName?: string;
            /** Format: uuid */
            requestTypeId?: string;
            requestTypeName?: string;
            minimumAmount?: number;
            maximumAmount?: number;
            /** Format: uuid */
            currencyId?: string;
            currencyCode?: string;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
            active?: boolean;
            steps?: components["schemas"]["ApproverStepResponse"][];
        };
        ApiResponseDelegationResolutionResponse: {
            success?: boolean;
            data?: components["schemas"]["DelegationResolutionResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        DelegationResolutionResponse: {
            /** Format: uuid */
            ruleId?: string;
            bandDescription?: string;
            /** Format: int32 */
            stepCount?: number;
            steps?: components["schemas"]["ApproverStepResponse"][];
            message?: string;
        };
        SmtpConfigurationRequest: {
            host: string;
            /** Format: int32 */
            port?: number;
            username?: string;
            password?: string;
            securityMode?: string;
            /** Format: email */
            fromEmail: string;
            fromDisplayName?: string;
            /** Format: email */
            replyTo?: string;
            /** Format: int32 */
            connectionTimeoutMs?: number;
            /** Format: int32 */
            readTimeoutMs?: number;
            active?: boolean;
        };
        ApiResponseSmtpConfigurationResponse: {
            success?: boolean;
            data?: components["schemas"]["SmtpConfigurationResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        SmtpConfigurationResponse: {
            /** Format: uuid */
            id?: string;
            host?: string;
            /** Format: int32 */
            port?: number;
            username?: string;
            passwordSet?: boolean;
            securityMode?: string;
            fromEmail?: string;
            fromDisplayName?: string;
            replyTo?: string;
            /** Format: int32 */
            connectionTimeoutMs?: number;
            /** Format: int32 */
            readTimeoutMs?: number;
            active?: boolean;
            /** Format: date-time */
            lastTestAt?: string;
            lastTestSuccess?: boolean;
            lastTestMessage?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        ApiResponseMapStringObject: {
            success?: boolean;
            data?: {
                [key: string]: unknown;
            };
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        TemplateUpsertRequest: {
            code: string;
            displayName: string;
            description?: string;
            eventCode: string;
            subject: string;
            htmlBody: string;
            textBody?: string;
            locale?: string;
            active?: boolean;
            allowedPlaceholders?: string[];
            changeNote?: string;
        };
        ApiResponseTemplateVersionResponse: {
            success?: boolean;
            data?: components["schemas"]["TemplateVersionResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        TemplateVersionResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            templateId?: string;
            /** Format: int32 */
            versionNumber?: number;
            subject?: string;
            htmlBody?: string;
            textBody?: string;
            locale?: string;
            changeNote?: string;
            allowedPlaceholders?: string[];
            /** Format: uuid */
            createdBy?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        ApiResponseMapStringString: {
            success?: boolean;
            data?: {
                [key: string]: string;
            };
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        SaveCommitteeRequest: {
            committeeCode: string;
            committeeName: string;
            description?: string;
        };
        ApiResponseCommitteeResponse: {
            success?: boolean;
            data?: components["schemas"]["CommitteeResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        CommitteeLevelResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: int32 */
            levelNumber?: number;
            levelName?: string;
            minimumAmount?: number;
            maximumAmount?: number;
            /** Format: uuid */
            currencyId?: string;
            currencyCode?: string;
            /** Format: int32 */
            minimumApprovals?: number;
            active?: boolean;
            members?: components["schemas"]["LevelMemberResponse"][];
        };
        CommitteeMemberResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            userId?: string;
            displayName?: string;
            memberType?: string;
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
            active?: boolean;
        };
        CommitteeResponse: {
            /** Format: uuid */
            id?: string;
            committeeCode?: string;
            committeeName?: string;
            description?: string;
            active?: boolean;
            levels?: components["schemas"]["CommitteeLevelResponse"][];
            members?: components["schemas"]["CommitteeMemberResponse"][];
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        LevelMemberResponse: {
            /** Format: uuid */
            memberId?: string;
            /** Format: uuid */
            userId?: string;
            displayName?: string;
            memberType?: string;
            mandatory?: boolean;
            /** Format: int32 */
            approvalOrder?: number;
        };
        AddMemberRequest: {
            /** Format: uuid */
            userId: string;
            /** @enum {string} */
            memberType: "CEO" | "CFO" | "HEAD_OF_ADMIN_GSD" | "MEMBER";
            /** Format: date-time */
            effectiveFrom?: string;
        };
        ApiResponseCommitteeMemberResponse: {
            success?: boolean;
            data?: components["schemas"]["CommitteeMemberResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        CommitteeLevelMemberRequest: {
            /** Format: uuid */
            memberId: string;
            mandatory?: boolean;
            /** Format: int32 */
            approvalOrder?: number;
        };
        CommitteeLevelRequest: {
            /** Format: int32 */
            levelNumber: number;
            levelName: string;
            minimumAmount: number;
            maximumAmount?: number;
            /** Format: uuid */
            currencyId: string;
            /** Format: int32 */
            minimumApprovals: number;
            members: components["schemas"]["CommitteeLevelMemberRequest"][];
        };
        ApiResponseCommitteeLevelResponse: {
            success?: boolean;
            data?: components["schemas"]["CommitteeLevelResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        CreateRuleSetRequest: {
            code: string;
            name: string;
            module: string;
            description?: string;
        };
        ApiResponseRuleVersionDetail: {
            success?: boolean;
            data?: components["schemas"]["RuleVersionDetail"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        RuleVersionDetail: {
            /** Format: uuid */
            id?: string;
            /** Format: int32 */
            versionNumber?: number;
            /** @enum {string} */
            status?: "DRAFT" | "PUBLISHED" | "RETIRED";
            /** Format: date-time */
            effectiveFrom?: string;
            /** Format: date-time */
            effectiveTo?: string;
            /** Format: date-time */
            publishedAt?: string;
            /** Format: uuid */
            publishedBy?: string;
            /** Format: int32 */
            ruleCount?: number;
            rules?: components["schemas"]["RuleDetail"][];
        };
        ResetPasswordRequest: {
            token: string;
            newPassword: string;
        };
        LoginRequest: {
            username: string;
            password: string;
        };
        ApiResponseCurrentUserResponse: {
            success?: boolean;
            data?: components["schemas"]["CurrentUserResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        CurrentUserResponse: {
            /** Format: uuid */
            userId?: string;
            username?: string;
            employeeCode?: string;
            displayName?: string;
            email?: string;
            designation?: string;
            /** Format: uuid */
            departmentId?: string;
            departmentName?: string;
            /** Format: uuid */
            branchId?: string;
            branchName?: string;
            roles?: string[];
            permissions?: string[];
            dataScopes?: components["schemas"]["DataScopeView"][];
            installationScope?: boolean;
            mustChangePassword?: boolean;
            /** Format: date-time */
            lastLoginAt?: string;
            passwordPolicy?: components["schemas"]["PasswordPolicyView"];
        };
        DataScopeView: {
            type?: string;
            /** Format: uuid */
            referenceId?: string;
            referenceName?: string;
        };
        PasswordPolicyView: {
            /** Format: int32 */
            minimumLength?: number;
            /** Format: int32 */
            maximumLength?: number;
            requireUppercase?: boolean;
            requireLowercase?: boolean;
            requireDigit?: boolean;
            requireSpecial?: boolean;
        };
        ForgotPasswordRequest: {
            /** Format: email */
            email: string;
        };
        ApiResponseNeutralResponse: {
            success?: boolean;
            data?: components["schemas"]["NeutralResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        NeutralResponse: {
            message?: string;
        };
        ChangePasswordRequest: {
            currentPassword: string;
            newPassword: string;
        };
        BootstrapRequest: {
            username: string;
            firstName: string;
            lastName: string;
            /** Format: email */
            email: string;
            employeeCode?: string;
            password: string;
        };
        ApiResponseBootstrapResponse: {
            success?: boolean;
            data?: components["schemas"]["BootstrapResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        BootstrapResponse: {
            /** Format: uuid */
            userId?: string;
            username?: string;
            displayName?: string;
            roles?: string[];
            /** Format: date-time */
            bootstrappedAt?: string;
        };
        RevertRequest: {
            remarks: string;
        };
        ActionResponse: {
            /** Format: uuid */
            taskId?: string;
            taskStatus?: string;
            workflowStateCode?: string;
            workflowStateType?: string;
            workflowCompleted?: boolean;
            /** Format: uuid */
            requestId?: string;
            requestStatus?: string;
            newTaskIds?: string[];
        };
        ApiResponseActionResponse: {
            success?: boolean;
            data?: components["schemas"]["ActionResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        RejectRequest: {
            remarks: string;
        };
        ForwardRequest: {
            /** Format: uuid */
            recipientUserId: string;
            remarks: string;
        };
        ApproveRequest: {
            remarks: string;
        };
        AuthorityCheckRequest: {
            /** Format: uuid */
            departmentId: string;
            expenseType: string;
            /** Format: uuid */
            currencyId: string;
            amount: number;
            candidateUserIds?: string[];
        };
        ApiResponseAuthorityCheck: {
            success?: boolean;
            data?: components["schemas"]["AuthorityCheck"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        AuthorityCheck: {
            /** Format: uuid */
            departmentId?: string;
            expenseType?: string;
            /** Format: uuid */
            currencyId?: string;
            amount?: number;
            permittedUserIds?: string[];
            reasons?: string[];
        };
        BulkSettingsUpdateRequest: {
            values: {
                [key: string]: unknown;
            };
        };
        ApiResponseListSettingResponse: {
            success?: boolean;
            data?: components["schemas"]["SettingResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        /** @description Partial update; only non-null fields are applied. */
        UpdateOrganizationProfileRequest: {
            organizationName?: string;
            displayName?: string;
            legalName?: string;
            organizationCode?: string;
            /** Format: email */
            contactEmail?: string;
            contactPhone?: string;
            website?: string;
            /** Format: email */
            supportEmail?: string;
            addressLine1?: string;
            addressLine2?: string;
            addressCity?: string;
            addressState?: string;
            addressPostalCode?: string;
            addressCountry?: string;
            /** Format: uuid */
            logoAssetId?: string;
            /** Format: uuid */
            faviconAssetId?: string;
            timezone?: string;
            dateFormat?: string;
            /** Format: uuid */
            defaultCurrencyId?: string;
        };
        ApiResponseListDefinitionResponse: {
            success?: boolean;
            data?: components["schemas"]["DefinitionResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListVersionResponse: {
            success?: boolean;
            data?: components["schemas"]["VersionResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseValidationResponse: {
            success?: boolean;
            data?: components["schemas"]["ValidationResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ValidationIssue: {
            severity?: string;
            field?: string;
            message?: string;
        };
        ValidationResponse: {
            /** Format: uuid */
            versionId?: string;
            valid?: boolean;
            issues?: components["schemas"]["ValidationIssue"][];
        };
        ApiResponseVersionCompareResponse: {
            success?: boolean;
            data?: components["schemas"]["VersionCompareResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        VersionCompareResponse: {
            /** Format: uuid */
            fromVersionId?: string;
            /** Format: int32 */
            fromVersionNumber?: number;
            /** Format: uuid */
            toVersionId?: string;
            /** Format: int32 */
            toVersionNumber?: number;
            entries?: components["schemas"]["VersionDiffEntry"][];
        };
        VersionDiffEntry: {
            kind?: string;
            change?: string;
            subject?: string;
            detail?: string;
        };
        ApiResponsePageResponseUserResponse: {
            success?: boolean;
            data?: components["schemas"]["PageResponseUserResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        PageResponseUserResponse: {
            items?: components["schemas"]["UserResponse"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
            hasNext?: boolean;
            hasPrevious?: boolean;
        };
        ApiResponseListUserRoleView: {
            success?: boolean;
            data?: components["schemas"]["UserRoleView"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseSetString: {
            success?: boolean;
            data?: string[];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListUserSummary: {
            success?: boolean;
            data?: components["schemas"]["UserSummary"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        UserSummary: {
            /** Format: uuid */
            id?: string;
            username?: string;
            displayName?: string;
            employeeCode?: string;
        };
        ApiResponseListThemeResponse: {
            success?: boolean;
            data?: components["schemas"]["ThemeResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListRoleResponse: {
            success?: boolean;
            data?: components["schemas"]["RoleResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponsePermissionCatalogue: {
            success?: boolean;
            data?: components["schemas"]["PermissionCatalogue"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        PermissionCatalogue: {
            modules?: components["schemas"]["PermissionGroup"][];
        };
        PermissionGroup: {
            module?: string;
            permissions?: components["schemas"]["PermissionView"][];
        };
        ApiResponseListString: {
            success?: boolean;
            data?: string[];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        Pageable: {
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            sort?: string[];
        };
        ApiResponseRegisterResponse: {
            success?: boolean;
            data?: components["schemas"]["RegisterResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        RegisterResponse: {
            rows?: components["schemas"]["RegisterRow"][];
            /** Format: int64 */
            total?: number;
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            totals?: components["schemas"]["RegisterTotals"];
            availableColumns?: string[];
        };
        RegisterRow: {
            /** Format: uuid */
            id?: string;
            requestNumber?: string;
            status?: string;
            expenseType?: string;
            requesterName?: string;
            /** Format: uuid */
            requesterId?: string;
            departmentName?: string;
            branchName?: string;
            categoryName?: string;
            subcategoryName?: string;
            currencyCode?: string;
            requestedAmount?: number;
            baseCurrencyAmount?: number;
            /** Format: date-time */
            submittedAt?: string;
            /** Format: date-time */
            decidedAt?: string;
            /** Format: int64 */
            decisionAgeSeconds?: number;
            lastActorName?: string;
        };
        RegisterTotals: {
            /** Format: int64 */
            totalCount?: number;
            totalBaseAmount?: number;
            /** Format: int64 */
            pendingCount?: number;
            pendingBaseAmount?: number;
            /** Format: int64 */
            approvedCount?: number;
            approvedBaseAmount?: number;
            /** Format: int64 */
            rejectedCount?: number;
            /** Format: int64 */
            returnedCount?: number;
            /** Format: int64 */
            cancelledCount?: number;
        };
        ApiResponseDashboardSummary: {
            success?: boolean;
            data?: components["schemas"]["DashboardSummary"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        DashboardSummary: {
            baseCurrencyCode?: string;
            metrics?: components["schemas"]["MetricCard"][];
            byStatus?: components["schemas"]["DistributionRow"][];
            byDepartment?: components["schemas"]["DistributionRow"][];
            byCategory?: components["schemas"]["DistributionRow"][];
            byExpenseType?: components["schemas"]["DistributionRow"][];
            trend?: components["schemas"]["TrendPoint"][];
        };
        DistributionRow: {
            key?: string;
            label?: string;
            /** Format: int64 */
            count?: number;
            amount?: number;
        };
        MetricCard: {
            key?: string;
            label?: string;
            value?: number;
            unit?: string;
            subtitle?: string;
        };
        TrendPoint: {
            /** Format: date-time */
            bucketStart?: string;
            /** Format: date-time */
            bucketEnd?: string;
            /** Format: int64 */
            count?: number;
            amount?: number;
        };
        ApiResponseListRecommendingAuthorityResponse: {
            success?: boolean;
            data?: components["schemas"]["RecommendingAuthorityResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseResolvedAuthority: {
            success?: boolean;
            data?: components["schemas"]["ResolvedAuthority"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ResolvedAuthority: {
            /** Format: uuid */
            departmentId?: string;
            expenseType?: string;
            /** Format: date-time */
            at?: string;
            /** Format: uuid */
            userId?: string;
            userDisplayName?: string;
            resolution?: string;
        };
        ApiResponsePublicConfigurationResponse: {
            success?: boolean;
            data?: components["schemas"]["PublicConfigurationResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        /** @description Safe subset of configuration exposed to unauthenticated callers */
        PublicConfigurationResponse: {
            applicationName?: string;
            organizationDisplayName?: string;
            organizationName?: string;
            supportEmail?: string;
            logoAssetId?: string;
            faviconAssetId?: string;
            defaultLocale?: string;
            defaultTimeZone?: string;
            dateFormat?: string;
            defaultCurrencyCode?: string;
            activeThemeName?: string;
            activeThemeType?: string;
            themeTokens?: {
                [key: string]: string;
            };
        };
        ApiResponseListOrganizationUnitResponse: {
            success?: boolean;
            data?: components["schemas"]["OrganizationUnitResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListOrganizationUnitNode: {
            success?: boolean;
            data?: components["schemas"]["OrganizationUnitNode"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        OrganizationUnitNode: {
            unit?: components["schemas"]["OrganizationUnitResponse"];
            children?: components["schemas"]["OrganizationUnitNode"][];
        };
        ApiResponseListOrganizationUnitTypeResponse: {
            success?: boolean;
            data?: components["schemas"]["OrganizationUnitTypeResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        OrganizationUnitTypeResponse: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            description?: string;
        };
        ApiResponseListDepartmentResponse: {
            success?: boolean;
            data?: components["schemas"]["DepartmentResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListBranchResponse: {
            success?: boolean;
            data?: components["schemas"]["BranchResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponsePageResponseNotificationResponse: {
            success?: boolean;
            data?: components["schemas"]["PageResponseNotificationResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        NotificationResponse: {
            /** Format: uuid */
            id?: string;
            eventCode?: string;
            title?: string;
            body?: string;
            linkUrl?: string;
            read?: boolean;
            /** Format: date-time */
            readAt?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        PageResponseNotificationResponse: {
            items?: components["schemas"]["NotificationResponse"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
            hasNext?: boolean;
            hasPrevious?: boolean;
        };
        ApiResponseMapStringLong: {
            success?: boolean;
            data?: {
                [key: string]: number;
            };
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponsePageResponseVendorResponse: {
            success?: boolean;
            data?: components["schemas"]["PageResponseVendorResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        PageResponseVendorResponse: {
            items?: components["schemas"]["VendorResponse"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
            hasNext?: boolean;
            hasPrevious?: boolean;
        };
        ApiResponseListTaxAuthorityResponse: {
            success?: boolean;
            data?: components["schemas"]["TaxAuthorityResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListExchangeRateResponse: {
            success?: boolean;
            data?: components["schemas"]["ExchangeRateResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListCurrencyResponse: {
            success?: boolean;
            data?: components["schemas"]["CurrencyResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListIntegrationSummary: {
            success?: boolean;
            data?: components["schemas"]["IntegrationSummary"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        IntegrationSummary: {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            providerType?: string;
            description?: string;
            endpointUrl?: string;
            /** @enum {string} */
            authMode?: "NONE" | "BASIC" | "BEARER" | "API_KEY" | "OAUTH2" | "CLIENT_CERTIFICATE" | "LDAP_BIND";
            active?: boolean;
            archived?: boolean;
            /** @enum {string} */
            connectionStatus?: "UNKNOWN" | "UNCONFIGURED" | "ACTIVE" | "INACTIVE" | "FAILED" | "TESTING";
            /** Format: date-time */
            lastTestAt?: string;
            lastTestSuccess?: boolean;
            lastTestMessage?: string;
            /** Format: int32 */
            lastTestDurationMs?: number;
            /** Format: date-time */
            connectionCheckedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            createdBy?: string;
            /** Format: date-time */
            updatedAt?: string;
            updatedBy?: string;
            /** Format: int64 */
            version?: number;
            hasSecret?: boolean;
            /** Format: int32 */
            secretVersion?: number;
        };
        ApiResponsePageExecutionSummary: {
            success?: boolean;
            data?: components["schemas"]["PageExecutionSummary"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        PageExecutionSummary: {
            /** Format: int32 */
            totalPages?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            size?: number;
            content?: components["schemas"]["ExecutionSummary"][];
            /** Format: int32 */
            number?: number;
            sort?: components["schemas"]["SortObject"];
            pageable?: components["schemas"]["PageableObject"];
            /** Format: int32 */
            numberOfElements?: number;
            first?: boolean;
            last?: boolean;
            empty?: boolean;
        };
        PageableObject: {
            /** Format: int64 */
            offset?: number;
            paged?: boolean;
            /** Format: int32 */
            pageNumber?: number;
            /** Format: int32 */
            pageSize?: number;
            sort?: components["schemas"]["SortObject"];
            unpaged?: boolean;
        };
        SortObject: {
            empty?: boolean;
            sorted?: boolean;
            unsorted?: boolean;
        };
        ApiResponseListProviderCatalogueEntry: {
            success?: boolean;
            data?: components["schemas"]["ProviderCatalogueEntry"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ProviderCatalogueEntry: {
            type?: string;
            name?: string;
            authModes?: string[];
            operations?: string[];
            requiresEndpointUrl?: boolean;
        };
        ApiResponseExecutionDetail: {
            success?: boolean;
            data?: components["schemas"]["ExecutionDetail"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ExecutionDetail: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            integrationConfigId?: string;
            operation?: string;
            idempotencyKey?: string;
            externalReference?: string;
            /** @enum {string} */
            status?: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "RETRY_PENDING" | "CANCELLED";
            /** Format: int32 */
            attemptCount?: number;
            /** Format: int32 */
            maxAttempts?: number;
            /** Format: date-time */
            startedAt?: string;
            /** Format: date-time */
            completedAt?: string;
            /** Format: date-time */
            nextRetryAt?: string;
            retryable?: boolean;
            requestMetadata?: {
                [key: string]: unknown;
            };
            responseMetadata?: {
                [key: string]: unknown;
            };
            errorCode?: string;
            errorMessage?: string;
            /** Format: uuid */
            triggeredBy?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            /** Format: int64 */
            version?: number;
        };
        ApiResponseListFeatureFlagResponse: {
            success?: boolean;
            data?: components["schemas"]["FeatureFlagResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponsePageResponseRequestSummary: {
            success?: boolean;
            data?: components["schemas"]["PageResponseRequestSummary"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        PageResponseRequestSummary: {
            items?: components["schemas"]["RequestSummary"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
            hasNext?: boolean;
            hasPrevious?: boolean;
        };
        RequestSummary: {
            /** Format: uuid */
            id?: string;
            requestNumber?: string;
            status?: string;
            classification?: string;
            /** Format: uuid */
            departmentId?: string;
            /** Format: uuid */
            currencyId?: string;
            requestedAmount?: number;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            submittedAt?: string;
        };
        ApiResponseTimelinePage: {
            success?: boolean;
            data?: components["schemas"]["TimelinePage"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        TimelineEntry: {
            source?: string;
            /** Format: uuid */
            eventId?: string;
            /** Format: date-time */
            timestamp?: string;
            /** Format: uuid */
            actorId?: string;
            actorName?: string;
            action?: string;
            description?: string;
            previousState?: string;
            newState?: string;
            remarks?: string;
            correlationId?: string;
        };
        TimelinePage: {
            items?: components["schemas"]["TimelineEntry"][];
            /** Format: int32 */
            size?: number;
            nextCursor?: string;
            hasNext?: boolean;
            /** Format: date-time */
            boundedAt?: string;
            complete?: boolean;
        };
        ApiResponseListLookupResponse: {
            success?: boolean;
            data?: components["schemas"]["LookupResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListCategoryResponse: {
            success?: boolean;
            data?: components["schemas"]["CategoryResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListExceedingLimitRuleResponse: {
            success?: boolean;
            data?: components["schemas"]["ExceedingLimitRuleResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseRuleEvaluation: {
            success?: boolean;
            data?: components["schemas"]["RuleEvaluation"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        RuleEvaluation: {
            /** Format: uuid */
            natureId?: string;
            /** Format: uuid */
            currencyId?: string;
            expenseType?: string;
            amount?: number;
            triggered?: components["schemas"]["ExceedingLimitRuleResponse"][];
            consequenceNote?: string;
        };
        ApiResponseListScanEventResponse: {
            success?: boolean;
            data?: components["schemas"]["ScanEventResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ScanEventResponse: {
            /** Format: uuid */
            id?: string;
            status?: string;
            scanner?: string;
            scannerVersion?: string;
            threatName?: string;
            /** Format: date-time */
            startedAt?: string;
            /** Format: date-time */
            finishedAt?: string;
            detail?: string;
        };
        ApiResponseListDocumentResponse: {
            success?: boolean;
            data?: components["schemas"]["DocumentResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListDelegationRuleResponse: {
            success?: boolean;
            data?: components["schemas"]["DelegationRuleResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListEventConfigResponse: {
            success?: boolean;
            data?: components["schemas"]["EventConfigResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListTemplateResponse: {
            success?: boolean;
            data?: components["schemas"]["TemplateResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListTemplateVersionResponse: {
            success?: boolean;
            data?: components["schemas"]["TemplateVersionResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListCommitteeResponse: {
            success?: boolean;
            data?: components["schemas"]["CommitteeResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListCommitteeCoverageResponse: {
            success?: boolean;
            data?: components["schemas"]["CommitteeCoverageResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        CommitteeCoverageResponse: {
            /** Format: uuid */
            committeeId?: string;
            committeeCode?: string;
            committeeName?: string;
            /** Format: uuid */
            levelId?: string;
            /** Format: int32 */
            levelNumber?: number;
            levelName?: string;
            amount?: number;
            currencyCode?: string;
            /** Format: int32 */
            minimumApprovals?: number;
            /** Format: int32 */
            mandatoryMembers?: number;
            /** Format: int32 */
            seatedMembers?: number;
            satisfiable?: boolean;
            explanation?: string;
        };
        ApiResponseListRuleSetSummary: {
            success?: boolean;
            data?: components["schemas"]["RuleSetSummary"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseInstallationStatusResponse: {
            success?: boolean;
            data?: components["schemas"]["InstallationStatusResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        InstallationStatusResponse: {
            bootstrapped?: boolean;
            /** Format: date-time */
            bootstrappedAt?: string;
        };
        ApiResponseCsrfTokenResponse: {
            success?: boolean;
            data?: components["schemas"]["CsrfTokenResponse"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        CsrfTokenResponse: {
            headerName?: string;
            parameterName?: string;
            token?: string;
        };
        ApiResponsePageResponseAuditEventSummary: {
            success?: boolean;
            data?: components["schemas"]["PageResponseAuditEventSummary"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        AuditEventSummary: {
            /** Format: uuid */
            id?: string;
            entityType?: string;
            entityId?: string;
            /** @enum {string} */
            action?: "CREATE" | "UPDATE" | "ACTIVATE" | "DEACTIVATE" | "DELETE" | "PUBLISH" | "ROLLBACK" | "SUBMIT" | "APPROVE" | "REJECT" | "REVERT" | "FORWARD" | "CANCEL" | "DOCUMENT_UPLOAD" | "DOCUMENT_DOWNLOAD" | "DOCUMENT_DELETE" | "SECRET_ROTATE" | "EXPORT" | "LOGIN_SUCCESS" | "LOGIN_FAILURE" | "ACCESS_DENIED" | "UNLOCK";
            /** Format: uuid */
            performedBy?: string;
            performedByUsername?: string;
            correlationId?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        PageResponseAuditEventSummary: {
            items?: components["schemas"]["AuditEventSummary"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
            hasNext?: boolean;
            hasPrevious?: boolean;
        };
        ApiResponseAuditEventDetail: {
            success?: boolean;
            data?: components["schemas"]["AuditEventDetail"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        AuditEventDetail: {
            /** Format: uuid */
            id?: string;
            entityType?: string;
            entityId?: string;
            /** @enum {string} */
            action?: "CREATE" | "UPDATE" | "ACTIVATE" | "DEACTIVATE" | "DELETE" | "PUBLISH" | "ROLLBACK" | "SUBMIT" | "APPROVE" | "REJECT" | "REVERT" | "FORWARD" | "CANCEL" | "DOCUMENT_UPLOAD" | "DOCUMENT_DOWNLOAD" | "DOCUMENT_DELETE" | "SECRET_ROTATE" | "EXPORT" | "LOGIN_SUCCESS" | "LOGIN_FAILURE" | "ACCESS_DENIED" | "UNLOCK";
            oldValues?: {
                [key: string]: unknown;
            };
            newValues?: {
                [key: string]: unknown;
            };
            /** Format: uuid */
            performedBy?: string;
            performedByUsername?: string;
            ipAddress?: string;
            correlationId?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        ApiResponsePageResponseApprovalTaskSummary: {
            success?: boolean;
            data?: components["schemas"]["PageResponseApprovalTaskSummary"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApprovalTaskSummary: {
            /** Format: uuid */
            taskId?: string;
            /** Format: uuid */
            requestId?: string;
            requestNumber?: string;
            requestStatus?: string;
            classification?: string;
            /** Format: uuid */
            departmentId?: string;
            requestedAmount?: number;
            currencyId?: string;
            stepCode?: string;
            stepName?: string;
            /** Format: int32 */
            stepOrder?: number;
            taskStatus?: string;
            /** Format: date-time */
            assignedAt?: string;
            /** Format: date-time */
            dueAt?: string;
            assignedVia?: string;
        };
        PageResponseApprovalTaskSummary: {
            items?: components["schemas"]["ApprovalTaskSummary"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
            hasNext?: boolean;
            hasPrevious?: boolean;
        };
        ActionAvailability: {
            action?: string;
            available?: boolean;
            reason?: string;
        };
        ApiResponseApprovalCaseFile: {
            success?: boolean;
            data?: components["schemas"]["ApprovalCaseFile"];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApprovalCaseFile: {
            /** Format: uuid */
            taskId?: string;
            /** Format: uuid */
            workflowInstanceId?: string;
            /** Format: uuid */
            workflowVersionId?: string;
            /** Format: int32 */
            workflowVersionNumber?: number;
            currentStateCode?: string;
            currentStateName?: string;
            currentStateType?: string;
            /** Format: uuid */
            requestId?: string;
            requestNumber?: string;
            open?: boolean;
            availableActions?: components["schemas"]["ActionAvailability"][];
            steps?: components["schemas"]["StepProgress"][];
            history?: components["schemas"]["WorkflowEventView"][];
        };
        StepProgress: {
            /** Format: uuid */
            stepId?: string;
            stepCode?: string;
            stepName?: string;
            /** Format: int32 */
            stepOrder?: number;
            approvalMode?: string;
            /** Format: int32 */
            minimumApprovals?: number;
            /** Format: int64 */
            approvedCount?: number;
            complete?: boolean;
            current?: boolean;
            tasks?: components["schemas"]["TaskProgress"][];
        };
        TaskProgress: {
            /** Format: uuid */
            taskId?: string;
            assignedTo?: string;
            status?: string;
            /** Format: date-time */
            assignedAt?: string;
            /** Format: date-time */
            completedAt?: string;
        };
        WorkflowEventView: {
            /** Format: uuid */
            actionId?: string;
            /** Format: uuid */
            taskId?: string;
            actionCode?: string;
            performedBy?: string;
            remarks?: string;
            previousStateCode?: string;
            nextStateCode?: string;
            /** Format: date-time */
            actionAt?: string;
        };
        ApiResponseLong: {
            success?: boolean;
            /** Format: int64 */
            data?: number;
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        ApiResponseListApprovalLimitResponse: {
            success?: boolean;
            data?: components["schemas"]["ApprovalLimitResponse"][];
            error?: components["schemas"]["ErrorBody"];
            fieldErrors?: components["schemas"]["FieldErrorDetail"][];
            correlationId?: string;
            path?: string;
            /** Format: date-time */
            timestamp?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                definitionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveDefinitionRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDefinitionResponse"];
                };
            };
        };
    };
    saveDraft: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                definitionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveDraftRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVersionResponse"];
                };
            };
        };
    };
    get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseUserResponse"];
                };
            };
        };
    };
    update_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseUserResponse"];
                };
            };
        };
    };
    getTheme: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseThemeResponse"];
                };
            };
        };
    };
    updateTheme: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveThemeRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseThemeResponse"];
                };
            };
        };
    };
    get_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRoleResponse"];
                };
            };
        };
    };
    update_2: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveRoleRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRoleResponse"];
                };
            };
        };
    };
    setPermissions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetPermissionsRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRoleResponse"];
                };
            };
        };
    };
    get_2: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRecommendingAuthorityResponse"];
                };
            };
        };
    };
    update_3: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveRecommendingAuthorityRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRecommendingAuthorityResponse"];
                };
            };
        };
    };
    updateUnit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrganizationUnitRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseOrganizationUnitResponse"];
                };
            };
        };
    };
    updateDepartment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveDepartmentRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDepartmentResponse"];
                };
            };
        };
    };
    updateBranch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveBranchRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseBranchResponse"];
                };
            };
        };
    };
    vendor: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVendorResponse"];
                };
            };
        };
    };
    updateVendor: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveVendorRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVendorResponse"];
                };
            };
        };
    };
    updateTaxAuthority: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveTaxAuthorityRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseTaxAuthorityResponse"];
                };
            };
        };
    };
    updateCurrency: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveCurrencyRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCurrencyResponse"];
                };
            };
        };
    };
    detail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseIntegrationDetail"];
                };
            };
        };
    };
    update_4: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateIntegrationRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseIntegrationDetail"];
                };
            };
        };
    };
    archive: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseIntegrationDetail"];
                };
            };
        };
    };
    get_3: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRequestResponse"];
                };
            };
        };
    };
    update_5: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRequestResponse"];
                };
            };
        };
    };
    updateSubcategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveSubcategoryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseSubcategoryResponse"];
                };
            };
        };
    };
    updateCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveCategoryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCategoryResponse"];
                };
            };
        };
    };
    get_4: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExceedingLimitRuleResponse"];
                };
            };
        };
    };
    update_6: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveExceedingLimitRuleRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExceedingLimitRuleResponse"];
                };
            };
        };
    };
    update_7: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventConfigRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseEventConfigResponse"];
                };
            };
        };
    };
    setActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseTemplateResponse"];
                };
            };
        };
    };
    get_5: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRuleVersionDetail"];
                };
            };
        };
    };
    update_8: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateRuleSetRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRuleSetSummary"];
                };
            };
        };
    };
    upsertRule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                versionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RuleUpsertRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRuleDetail"];
                };
            };
        };
    };
    get_6: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseApprovalLimitResponse"];
                };
            };
        };
    };
    update_9: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveApprovalLimitRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseApprovalLimitResponse"];
                };
            };
        };
    };
    list: {
        parameters: {
            query?: {
                includeInactive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListDefinitionResponse"];
                };
            };
        };
    };
    create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveDefinitionRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDefinitionResponse"];
                };
            };
        };
    };
    rollbackIntoDraft: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                definitionId: string;
                sourceVersionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVersionResponse"];
                };
            };
        };
    };
    clonePublished: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                definitionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVersionResponse"];
                };
            };
        };
    };
    setActive_1: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                definitionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDefinitionResponse"];
                };
            };
        };
    };
    retire: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                versionId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RetireRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVersionResponse"];
                };
            };
        };
    };
    publish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                versionId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PublishRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVersionResponse"];
                };
            };
        };
    };
    list_1: {
        parameters: {
            query?: {
                search?: string;
                departmentId?: string;
                active?: boolean;
                page?: number;
                size?: number;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePageResponseUserResponse"];
                };
            };
        };
    };
    create_1: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUserRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseUserCreatedResponse"];
                };
            };
        };
    };
    unlock: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseUserResponse"];
                };
            };
        };
    };
    assignScope: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignScopeRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseUserScopeView"];
                };
            };
        };
    };
    roles: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListUserRoleView"];
                };
            };
        };
    };
    assignRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignRoleRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseUserRoleView"];
                };
            };
        };
    };
    triggerPasswordReset: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    setActive_2: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseUserResponse"];
                };
            };
        };
    };
    listThemes: {
        parameters: {
            query?: {
                includeInactive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListThemeResponse"];
                };
            };
        };
    };
    createTheme: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveThemeRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseThemeResponse"];
                };
            };
        };
    };
    setDefaultTheme: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseThemeResponse"];
                };
            };
        };
    };
    setThemeActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseThemeResponse"];
                };
            };
        };
    };
    listSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListSettingResponse"];
                };
            };
        };
    };
    saveSetting: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveSettingRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseSettingResponse"];
                };
            };
        };
    };
    list_2: {
        parameters: {
            query?: {
                includeInactive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListRoleResponse"];
                };
            };
        };
    };
    create_2: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveRoleRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRoleResponse"];
                };
            };
        };
    };
    setActive_3: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRoleResponse"];
                };
            };
        };
    };
    export: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExportRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    list_3: {
        parameters: {
            query?: {
                departmentId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListRecommendingAuthorityResponse"];
                };
            };
        };
    };
    create_3: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveRecommendingAuthorityRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRecommendingAuthorityResponse"];
                };
            };
        };
    };
    setActive_4: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRecommendingAuthorityResponse"];
                };
            };
        };
    };
    units: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListOrganizationUnitResponse"];
                };
            };
        };
    };
    createUnit: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateOrganizationUnitRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseOrganizationUnitResponse"];
                };
            };
        };
    };
    setUnitActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseOrganizationUnitResponse"];
                };
            };
        };
    };
    getProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseOrganizationProfileResponse"];
                };
            };
        };
    };
    createProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateOrganizationProfileRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseOrganizationProfileResponse"];
                };
            };
        };
    };
    updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrganizationProfileRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseOrganizationProfileResponse"];
                };
            };
        };
    };
    departments: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListDepartmentResponse"];
                };
            };
        };
    };
    createDepartment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveDepartmentRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDepartmentResponse"];
                };
            };
        };
    };
    setDepartmentActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDepartmentResponse"];
                };
            };
        };
    };
    branches: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListBranchResponse"];
                };
            };
        };
    };
    createBranch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveBranchRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseBranchResponse"];
                };
            };
        };
    };
    setBranchActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseBranchResponse"];
                };
            };
        };
    };
    markRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    markAllRead: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseMapStringInteger"];
                };
            };
        };
    };
    vendors: {
        parameters: {
            query?: {
                search?: string;
                page?: number;
                size?: number;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePageResponseVendorResponse"];
                };
            };
        };
    };
    createVendor: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveVendorRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVendorResponse"];
                };
            };
        };
    };
    setVendorActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVendorResponse"];
                };
            };
        };
    };
    taxAuthorities: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListTaxAuthorityResponse"];
                };
            };
        };
    };
    createTaxAuthority: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveTaxAuthorityRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseTaxAuthorityResponse"];
                };
            };
        };
    };
    setTaxAuthorityActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseTaxAuthorityResponse"];
                };
            };
        };
    };
    exchangeRates: {
        parameters: {
            query?: {
                fromCurrencyId?: string;
                toCurrencyId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListExchangeRateResponse"];
                };
            };
        };
    };
    createRate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveExchangeRateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExchangeRateResponse"];
                };
            };
        };
    };
    closeRate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CloseExchangeRateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExchangeRateResponse"];
                };
            };
        };
    };
    currencies: {
        parameters: {
            query?: {
                includeInactive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListCurrencyResponse"];
                };
            };
        };
    };
    createCurrency: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveCurrencyRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCurrencyResponse"];
                };
            };
        };
    };
    setCurrencyActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCurrencyResponse"];
                };
            };
        };
    };
    list_4: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListIntegrationSummary"];
                };
            };
        };
    };
    create_4: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateIntegrationRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseIntegrationDetail"];
                };
            };
        };
    };
    test: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseConnectionTestResponse"];
                };
            };
        };
    };
    history: {
        parameters: {
            query?: {
                status?: string;
                page?: number;
                size?: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePageExecutionSummary"];
                };
            };
        };
    };
    execute: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExecuteRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExecutionSummary"];
                };
            };
        };
    };
    deactivate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseIntegrationDetail"];
                };
            };
        };
    };
    activate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseIntegrationDetail"];
                };
            };
        };
    };
    retry: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                execId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RetryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExecutionSummary"];
                };
            };
        };
    };
    listFlags: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListFeatureFlagResponse"];
                };
            };
        };
    };
    saveFlag: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveFeatureFlagRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseFeatureFlagResponse"];
                };
            };
        };
    };
    setFlagEnabled: {
        parameters: {
            query: {
                enabled: boolean;
            };
            header?: never;
            path: {
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseFeatureFlagResponse"];
                };
            };
        };
    };
    list_5: {
        parameters: {
            query?: {
                search?: string;
                status?: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "RETURNED" | "APPROVED" | "REJECTED" | "CANCELLED" | "REVERSED";
                departmentId?: string;
                categoryId?: string;
                mineOnly?: boolean;
                page?: number;
                size?: number;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePageResponseRequestSummary"];
                };
            };
        };
    };
    create_5: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRequestResponse"];
                };
            };
        };
    };
    submit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRequestResponse"];
                };
            };
        };
    };
    cancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CancelRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRequestResponse"];
                };
            };
        };
    };
    setSubcategoryActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseSubcategoryResponse"];
                };
            };
        };
    };
    requestTypes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListLookupResponse"];
                };
            };
        };
    };
    createRequestType: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveLookupRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseLookupResponse"];
                };
            };
        };
    };
    natures: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListLookupResponse"];
                };
            };
        };
    };
    createNature: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveLookupRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseLookupResponse"];
                };
            };
        };
    };
    setNatureActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseLookupResponse"];
                };
            };
        };
    };
    categories: {
        parameters: {
            query?: {
                includeInactive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListCategoryResponse"];
                };
            };
        };
    };
    createCategory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveCategoryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCategoryResponse"];
                };
            };
        };
    };
    setCategoryActive: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCategoryResponse"];
                };
            };
        };
    };
    createSubcategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                categoryId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveSubcategoryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseSubcategoryResponse"];
                };
            };
        };
    };
    list_6: {
        parameters: {
            query?: {
                includeInactive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListExceedingLimitRuleResponse"];
                };
            };
        };
    };
    create_6: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveExceedingLimitRuleRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExceedingLimitRuleResponse"];
                };
            };
        };
    };
    setActive_5: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExceedingLimitRuleResponse"];
                };
            };
        };
    };
    upload: {
        parameters: {
            query: {
                expenseRequestId: string;
                category: string;
                description?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDocumentResponse"];
                };
            };
        };
    };
    list_7: {
        parameters: {
            query?: {
                categoryId?: string;
                includeInactive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListDelegationRuleResponse"];
                };
            };
        };
    };
    create_7: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveDelegationRuleRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDelegationRuleResponse"];
                };
            };
        };
    };
    close: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDelegationRuleResponse"];
                };
            };
        };
    };
    setActive_6: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDelegationRuleResponse"];
                };
            };
        };
    };
    preview: {
        parameters: {
            query: {
                categoryId: string;
                subcategoryId?: string;
                natureId: string;
                requestTypeId?: string;
                currencyId: string;
                amount: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDelegationResolutionResponse"];
                };
            };
        };
    };
    get_7: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseSmtpConfigurationResponse"];
                };
            };
        };
    };
    save: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SmtpConfigurationRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseSmtpConfigurationResponse"];
                };
            };
        };
    };
    test_1: {
        parameters: {
            query: {
                recipient: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["SmtpConfigurationRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseMapStringObject"];
                };
            };
        };
    };
    list_8: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListTemplateResponse"];
                };
            };
        };
    };
    create_8: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TemplateUpsertRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseTemplateResponse"];
                };
            };
        };
    };
    history_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListTemplateVersionResponse"];
                };
            };
        };
    };
    newVersion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TemplateUpsertRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseTemplateVersionResponse"];
                };
            };
        };
    };
    preview_1: {
        parameters: {
            query?: {
                version?: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    [key: string]: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseMapStringString"];
                };
            };
        };
    };
    list_9: {
        parameters: {
            query?: {
                includeInactive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListCommitteeResponse"];
                };
            };
        };
    };
    create_9: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveCommitteeRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCommitteeResponse"];
                };
            };
        };
    };
    get_8: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCommitteeResponse"];
                };
            };
        };
    };
    rename: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveCommitteeRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCommitteeResponse"];
                };
            };
        };
    };
    addMember: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddMemberRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCommitteeMemberResponse"];
                };
            };
        };
    };
    endMembership: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                memberId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    addLevel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CommitteeLevelRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCommitteeLevelResponse"];
                };
            };
        };
    };
    deactivateLevel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                levelId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    deactivate_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    list_10: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListRuleSetSummary"];
                };
            };
        };
    };
    create_10: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRuleSetRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRuleSetSummary"];
                };
            };
        };
    };
    retire_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRuleVersionDetail"];
                };
            };
        };
    };
    publish_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PublishRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRuleVersionDetail"];
                };
            };
        };
    };
    newDraft: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRuleVersionDetail"];
                };
            };
        };
    };
    resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetPasswordRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCurrentUserResponse"];
                };
            };
        };
    };
    forgotPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ForgotPasswordRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseNeutralResponse"];
                };
            };
        };
    };
    changePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    bootstrap: {
        parameters: {
            query?: never;
            header?: {
                "X-Installation-Token"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BootstrapRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseBootstrapResponse"];
                };
            };
        };
    };
    revert: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                taskId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RevertRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseActionResponse"];
                };
            };
        };
    };
    reject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                taskId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RejectRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseActionResponse"];
                };
            };
        };
    };
    forward: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                taskId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ForwardRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseActionResponse"];
                };
            };
        };
    };
    approve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                taskId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApproveRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseActionResponse"];
                };
            };
        };
    };
    list_11: {
        parameters: {
            query?: {
                departmentId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListApprovalLimitResponse"];
                };
            };
        };
    };
    create_11: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveApprovalLimitRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseApprovalLimitResponse"];
                };
            };
        };
    };
    setActive_7: {
        parameters: {
            query: {
                active: boolean;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseApprovalLimitResponse"];
                };
            };
        };
    };
    checkAuthority: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AuthorityCheckRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseAuthorityCheck"];
                };
            };
        };
    };
    bulkUpdateSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BulkSettingsUpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListSettingResponse"];
                };
            };
        };
    };
    versions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                definitionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListVersionResponse"];
                };
            };
        };
    };
    version: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                versionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVersionResponse"];
                };
            };
        };
    };
    validate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                versionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseValidationResponse"];
                };
            };
        };
    };
    compare: {
        parameters: {
            query: {
                from: string;
                to: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVersionCompareResponse"];
                };
            };
        };
    };
    effectivePermissions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseSetString"];
                };
            };
        };
    };
    search: {
        parameters: {
            query?: {
                q?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListUserSummary"];
                };
            };
        };
    };
    activeTheme: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseThemeResponse"];
                };
            };
        };
    };
    info: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseMapStringObject"];
                };
            };
        };
    };
    getSetting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseSettingResponse"];
                };
            };
        };
    };
    listByCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListSettingResponse"];
                };
            };
        };
    };
    catalogue: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePermissionCatalogue"];
                };
            };
        };
    };
    widgetCatalogue: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListString"];
                };
            };
        };
    };
    reportCatalogue: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListString"];
                };
            };
        };
    };
    register: {
        parameters: {
            query: {
                departmentId?: string;
                branchId?: string;
                categoryId?: string;
                subcategoryId?: string;
                requesterId?: string;
                expenseType?: string;
                status?: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "RETURNED" | "APPROVED" | "REJECTED" | "CANCELLED" | "REVERSED";
                currency?: string;
                from?: string;
                to?: string;
                search?: string;
                pageable: components["schemas"]["Pageable"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRegisterResponse"];
                };
            };
        };
    };
    dashboard: {
        parameters: {
            query?: {
                departmentId?: string;
                branchId?: string;
                categoryId?: string;
                subcategoryId?: string;
                requesterId?: string;
                expenseType?: string;
                currency?: string;
                status?: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "RETURNED" | "APPROVED" | "REJECTED" | "CANCELLED" | "REVERSED";
                from?: string;
                to?: string;
                search?: string;
                lookbackDays?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDashboardSummary"];
                };
            };
        };
    };
    resolved: {
        parameters: {
            query: {
                departmentId: string;
                expenseType?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseResolvedAuthority"];
                };
            };
        };
    };
    publicConfiguration: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePublicConfigurationResponse"];
                };
            };
        };
    };
    tree: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListOrganizationUnitNode"];
                };
            };
        };
    };
    unitTypes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListOrganizationUnitTypeResponse"];
                };
            };
        };
    };
    list_12: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePageResponseNotificationResponse"];
                };
            };
        };
    };
    unreadCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseMapStringLong"];
                };
            };
        };
    };
    providers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListProviderCatalogueEntry"];
                };
            };
        };
    };
    executionDetail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                execId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseExecutionDetail"];
                };
            };
        };
    };
    getFlag: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseFeatureFlagResponse"];
                };
            };
        };
    };
    timeline: {
        parameters: {
            query?: {
                /** @description Page size, capped at 200. */
                size?: number;
                /** @description Opaque continuation cursor from the previous response. */
                cursor?: string;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseTimelinePage"];
                };
            };
        };
    };
    evaluate: {
        parameters: {
            query: {
                expenseType: string;
                natureId: string;
                currencyId: string;
                amount: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRuleEvaluation"];
                };
            };
        };
    };
    get_9: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseDocumentResponse"];
                };
            };
        };
    };
    delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    scans: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListScanEventResponse"];
                };
            };
        };
    };
    downloadUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseMapStringObject"];
                };
            };
        };
    };
    listForRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListDocumentResponse"];
                };
            };
        };
    };
    me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseMapStringObject"];
                };
            };
        };
    };
    permissions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListString"];
                };
            };
        };
    };
    list_13: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListEventConfigResponse"];
                };
            };
        };
    };
    get_10: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseTemplateResponse"];
                };
            };
        };
    };
    coverage: {
        parameters: {
            query: {
                currencyId: string;
                amount: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseListCommitteeCoverageResponse"];
                };
            };
        };
    };
    currentUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCurrentUserResponse"];
                };
            };
        };
    };
    installationStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseInstallationStatusResponse"];
                };
            };
        };
    };
    csrf: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseCsrfTokenResponse"];
                };
            };
        };
    };
    search_1: {
        parameters: {
            query?: {
                /** @description Window start (inclusive, ISO-8601 instant). Defaults to 24 hours ago. */
                from?: string;
                /** @description Window end (exclusive, ISO-8601 instant). Defaults to now. */
                to?: string;
                /** @description Actor user id filter. */
                actorId?: string;
                /** @description Actor username substring filter (case-insensitive). */
                actorName?: string;
                /** @description Entity/module type, e.g. ExpenseRequest. */
                entityType?: string;
                /** @description Entity id filter (exact match). */
                entityId?: string;
                /** @description Action filter (exact enum name). */
                action?: "CREATE" | "UPDATE" | "ACTIVATE" | "DEACTIVATE" | "DELETE" | "PUBLISH" | "ROLLBACK" | "SUBMIT" | "APPROVE" | "REJECT" | "REVERT" | "FORWARD" | "CANCEL" | "DOCUMENT_UPLOAD" | "DOCUMENT_DOWNLOAD" | "DOCUMENT_DELETE" | "SECRET_ROTATE" | "EXPORT" | "LOGIN_SUCCESS" | "LOGIN_FAILURE" | "ACCESS_DENIED" | "UNLOCK";
                /** @description Correlation id filter (exact match). */
                correlationId?: string;
                page?: number;
                size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePageResponseAuditEventSummary"];
                };
            };
        };
    };
    get_11: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseAuditEventDetail"];
                };
            };
        };
    };
    inbox: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponsePageResponseApprovalTaskSummary"];
                };
            };
        };
    };
    caseFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseApprovalCaseFile"];
                };
            };
        };
    };
    requestFor: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseRequestResponse"];
                };
            };
        };
    };
    count: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseLong"];
                };
            };
        };
    };
    removeScope: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                scopeId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    revokeRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                assignmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    deactivate_2: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseMapStringObject"];
                };
            };
        };
    };
    deleteRule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ruleId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
}

# APPENDIX A — Complete API Endpoint Inventory

**Total `/api/v1` endpoints: 206** — 8 public, 3 authenticated-only, 195 permission-guarded.

Source-verified against `src/main/java/com/edam/**/*Controller.java` and `Permissions.java`.

| ID | Method | Path | Handler | Access | CSRF | Source |
|----|--------|------|---------|--------|------|--------|
| **Approval inbox & actions** | | | | | | |
| APL-001 | `GET` | `/api/v1/approvals` | `ApprovalController#inbox` | `approval:view` | No | `com/edam/workflow/controller/ApprovalController.java` |
| APL-002 | `GET` | `/api/v1/approvals/count` | `ApprovalController#count` | `approval:view` | No | `com/edam/workflow/controller/ApprovalController.java` |
| APL-003 | `GET` | `/api/v1/approvals/tasks/{taskId}` | `ApprovalController#caseFile` | `approval:view` | No | `com/edam/workflow/controller/ApprovalController.java` |
| APL-004 | `POST` | `/api/v1/approvals/tasks/{taskId}/approve` | `ApprovalController#approve` | `approval:act` | Yes | `com/edam/workflow/controller/ApprovalController.java` |
| APL-005 | `POST` | `/api/v1/approvals/tasks/{taskId}/forward` | `ApprovalController#forward` | `approval:act` | Yes | `com/edam/workflow/controller/ApprovalController.java` |
| APL-006 | `POST` | `/api/v1/approvals/tasks/{taskId}/reject` | `ApprovalController#reject` | `approval:act` | Yes | `com/edam/workflow/controller/ApprovalController.java` |
| APL-007 | `GET` | `/api/v1/approvals/tasks/{taskId}/request` | `ApprovalController#requestFor` | `approval:view` | No | `com/edam/workflow/controller/ApprovalController.java` |
| APL-008 | `POST` | `/api/v1/approvals/tasks/{taskId}/revert` | `ApprovalController#revert` | `approval:act` | Yes | `com/edam/workflow/controller/ApprovalController.java` |
| **Audit** | | | | | | |
| AUD-001 | `GET` | `/api/v1/audit-events` | `AuditController#search` | `audit:view` | No | `com/edam/audit/controller/AuditController.java` |
| AUD-002 | `GET` | `/api/v1/audit-events/{id}` | `AuditController#get` | `audit:view` | No | `com/edam/audit/controller/AuditController.java` |
| **Authentication** | | | | | | |
| AUTH-001 | `POST` | `/api/v1/auth/bootstrap` | `AuthController#bootstrap` | public (no auth) | Yes | `com/edam/identity/controller/AuthController.java` |
| AUTH-002 | `POST` | `/api/v1/auth/change-password` | `AuthController#changePassword` | authenticated (any logged-in user) | Yes | `com/edam/identity/controller/AuthController.java` |
| AUTH-003 | `GET` | `/api/v1/auth/csrf` | `AuthController#csrf` | public (no auth) | No | `com/edam/identity/controller/AuthController.java` |
| AUTH-004 | `POST` | `/api/v1/auth/forgot-password` | `AuthController#forgotPassword` | public (no auth) | Yes | `com/edam/identity/controller/AuthController.java` |
| AUTH-005 | `GET` | `/api/v1/auth/installation` | `AuthController#installationStatus` | public (no auth) | No | `com/edam/identity/controller/AuthController.java` |
| AUTH-006 | `POST` | `/api/v1/auth/login` | `AuthController#login` | public (no auth) | Yes | `com/edam/identity/controller/AuthController.java` |
| AUTH-007 | `POST` | `/api/v1/auth/logout` | `AuthController#logout` | public (no auth) | Yes | `com/edam/identity/controller/AuthController.java` |
| AUTH-008 | `GET` | `/api/v1/auth/me` | `AuthController#currentUser` | authenticated (any logged-in user) | No | `com/edam/identity/controller/AuthController.java` |
| AUTH-009 | `POST` | `/api/v1/auth/reset-password` | `AuthController#resetPassword` | public (no auth) | Yes | `com/edam/identity/controller/AuthController.java` |
| **Business rules** | | | | | | |
| BR-001 | `GET` | `/api/v1/business-rules` | `BusinessRuleController#list` | `rule:view` | No | `com/edam/businessrules/controller/BusinessRuleController.java` |
| BR-002 | `POST` | `/api/v1/business-rules` | `BusinessRuleController#create` | `rule:manage` | Yes | `com/edam/businessrules/controller/BusinessRuleController.java` |
| BR-003 | `DELETE` | `/api/v1/business-rules/rules/{ruleId}` | `BusinessRuleController#deleteRule` | `rule:manage` | Yes | `com/edam/businessrules/controller/BusinessRuleController.java` |
| BR-004 | `PUT` | `/api/v1/business-rules/versions/{versionId}/rules` | `BusinessRuleController#upsertRule` | `rule:manage` | Yes | `com/edam/businessrules/controller/BusinessRuleController.java` |
| BR-005 | `GET` | `/api/v1/business-rules/{id}` | `BusinessRuleController#get` | `rule:view` | No | `com/edam/businessrules/controller/BusinessRuleController.java` |
| BR-006 | `PUT` | `/api/v1/business-rules/{id}` | `BusinessRuleController#update` | `rule:manage` | Yes | `com/edam/businessrules/controller/BusinessRuleController.java` |
| BR-007 | `POST` | `/api/v1/business-rules/{id}/drafts` | `BusinessRuleController#newDraft` | `rule:manage` | Yes | `com/edam/businessrules/controller/BusinessRuleController.java` |
| BR-008 | `POST` | `/api/v1/business-rules/{id}/publish` | `BusinessRuleController#publish` | `rule:publish` | Yes | `com/edam/businessrules/controller/BusinessRuleController.java` |
| BR-009 | `POST` | `/api/v1/business-rules/{id}/retire` | `BusinessRuleController#retire` | `rule:publish` | Yes | `com/edam/businessrules/controller/BusinessRuleController.java` |
| **Branding/configuration** | | | | | | |
| BRD-001 | `GET` | `/api/v1/feature-flags` | `ConfigurationController#listFlags` | `configuration:view` | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-002 | `POST` | `/api/v1/feature-flags` | `ConfigurationController#saveFlag` | `configuration:manage` | Yes | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-003 | `GET` | `/api/v1/feature-flags/{key}` | `ConfigurationController#getFlag` | `configuration:view` | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-004 | `POST` | `/api/v1/feature-flags/{key}/activation` | `ConfigurationController#setFlagEnabled` | `configuration:manage` | Yes | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-005 | `GET` | `/api/v1/public/configuration` | `ConfigurationController#publicConfiguration` | public (no auth) | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-006 | `GET` | `/api/v1/settings` | `ConfigurationController#listSettings` | `configuration:view` | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-007 | `POST` | `/api/v1/settings` | `ConfigurationController#saveSetting` | `configuration:manage` | Yes | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-008 | `PATCH` | `/api/v1/settings/bulk` | `ConfigurationController#bulkUpdateSettings` | `configuration:manage` | Yes | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-009 | `GET` | `/api/v1/settings/categories/{category}` | `ConfigurationController#listByCategory` | `configuration:view` | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-010 | `GET` | `/api/v1/settings/{key}` | `ConfigurationController#getSetting` | `configuration:view` | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-011 | `GET` | `/api/v1/themes` | `ConfigurationController#listThemes` | `configuration:view` | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-012 | `POST` | `/api/v1/themes` | `ConfigurationController#createTheme` | `configuration:manage` | Yes | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-013 | `GET` | `/api/v1/themes/active` | `ConfigurationController#activeTheme` | `configuration:view` | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-014 | `GET` | `/api/v1/themes/{id}` | `ConfigurationController#getTheme` | `configuration:view` | No | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-015 | `PUT` | `/api/v1/themes/{id}` | `ConfigurationController#updateTheme` | `configuration:manage` | Yes | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-016 | `POST` | `/api/v1/themes/{id}/activation` | `ConfigurationController#setThemeActive` | `configuration:manage` | Yes | `com/edam/configuration/controller/ConfigurationController.java` |
| BRD-017 | `POST` | `/api/v1/themes/{id}/default` | `ConfigurationController#setDefaultTheme` | `configuration:manage` | Yes | `com/edam/configuration/controller/ConfigurationController.java` |
| **Expense configuration** | | | | | | |
| CFG-001 | `GET` | `/api/v1/expense-configuration/categories` | `ExpenseConfigurationController#categories` | `expense-configuration:view` | No | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-002 | `POST` | `/api/v1/expense-configuration/categories` | `ExpenseConfigurationController#createCategory` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-003 | `POST` | `/api/v1/expense-configuration/categories/{categoryId}/subcategories` | `ExpenseConfigurationController#createSubcategory` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-004 | `PUT` | `/api/v1/expense-configuration/categories/{id}` | `ExpenseConfigurationController#updateCategory` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-005 | `POST` | `/api/v1/expense-configuration/categories/{id}/activation` | `ExpenseConfigurationController#setCategoryActive` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-006 | `GET` | `/api/v1/expense-configuration/natures` | `ExpenseConfigurationController#natures` | `expense-configuration:view` | No | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-007 | `POST` | `/api/v1/expense-configuration/natures` | `ExpenseConfigurationController#createNature` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-008 | `POST` | `/api/v1/expense-configuration/natures/{id}/activation` | `ExpenseConfigurationController#setNatureActive` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-009 | `GET` | `/api/v1/expense-configuration/request-types` | `ExpenseConfigurationController#requestTypes` | `expense-configuration:view` | No | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-010 | `POST` | `/api/v1/expense-configuration/request-types` | `ExpenseConfigurationController#createRequestType` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-011 | `PUT` | `/api/v1/expense-configuration/subcategories/{id}` | `ExpenseConfigurationController#updateSubcategory` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| CFG-012 | `POST` | `/api/v1/expense-configuration/subcategories/{id}/activation` | `ExpenseConfigurationController#setSubcategoryActive` | `expense-configuration:manage` | Yes | `com/edam/expenseconfiguration/controller/ExpenseConfigurationController.java` |
| **Committees** | | | | | | |
| CMT-001 | `GET` | `/api/v1/committees` | `CommitteeController#list` | `committee:view` | No | `com/edam/committee/controller/CommitteeController.java` |
| CMT-002 | `POST` | `/api/v1/committees` | `CommitteeController#create` | `committee:manage` | Yes | `com/edam/committee/controller/CommitteeController.java` |
| CMT-003 | `GET` | `/api/v1/committees/coverage` | `CommitteeController#coverage` | `committee:view` | No | `com/edam/committee/controller/CommitteeController.java` |
| CMT-004 | `GET` | `/api/v1/committees/{id}` | `CommitteeController#get` | `committee:view` | No | `com/edam/committee/controller/CommitteeController.java` |
| CMT-005 | `POST` | `/api/v1/committees/{id}` | `CommitteeController#rename` | `committee:manage` | Yes | `com/edam/committee/controller/CommitteeController.java` |
| CMT-006 | `POST` | `/api/v1/committees/{id}/deactivate` | `CommitteeController#deactivate` | `committee:manage` | Yes | `com/edam/committee/controller/CommitteeController.java` |
| CMT-007 | `POST` | `/api/v1/committees/{id}/levels` | `CommitteeController#addLevel` | `committee:manage` | Yes | `com/edam/committee/controller/CommitteeController.java` |
| CMT-008 | `POST` | `/api/v1/committees/{id}/levels/{levelId}/deactivate` | `CommitteeController#deactivateLevel` | `committee:manage` | Yes | `com/edam/committee/controller/CommitteeController.java` |
| CMT-009 | `POST` | `/api/v1/committees/{id}/members` | `CommitteeController#addMember` | `committee:manage` | Yes | `com/edam/committee/controller/CommitteeController.java` |
| CMT-010 | `POST` | `/api/v1/committees/{id}/members/{memberId}/end` | `CommitteeController#endMembership` | `committee:manage` | Yes | `com/edam/committee/controller/CommitteeController.java` |
| **Delegation** | | | | | | |
| DEL-001 | `GET` | `/api/v1/delegation-matrix` | `DelegationMatrixController#list` | `delegation:view` | No | `com/edam/delegation/controller/DelegationMatrixController.java` |
| DEL-002 | `POST` | `/api/v1/delegation-matrix` | `DelegationMatrixController#create` | `delegation:manage` | Yes | `com/edam/delegation/controller/DelegationMatrixController.java` |
| DEL-003 | `POST` | `/api/v1/delegation-matrix/preview` | `DelegationMatrixController#preview` | `delegation:view` | Yes | `com/edam/delegation/controller/DelegationMatrixController.java` |
| DEL-004 | `POST` | `/api/v1/delegation-matrix/{id}/activation` | `DelegationMatrixController#setActive` | `delegation:manage` | Yes | `com/edam/delegation/controller/DelegationMatrixController.java` |
| DEL-005 | `POST` | `/api/v1/delegation-matrix/{id}/close` | `DelegationMatrixController#close` | `delegation:manage` | Yes | `com/edam/delegation/controller/DelegationMatrixController.java` |
| **Documents** | | | | | | |
| DOC-001 | `POST` | `/api/v1/documents` | `DocumentController#upload` | `document:upload` | Yes | `com/edam/documents/controller/DocumentController.java` |
| DOC-002 | `GET` | `/api/v1/documents/requests/{requestId}` | `DocumentController#listForRequest` | `document:download` | No | `com/edam/documents/controller/DocumentController.java` |
| DOC-003 | `GET` | `/api/v1/documents/{id}` | `DocumentController#get` | `document:download` | No | `com/edam/documents/controller/DocumentController.java` |
| DOC-004 | `DELETE` | `/api/v1/documents/{id}` | `DocumentController#delete` | `document:delete` | Yes | `com/edam/documents/controller/DocumentController.java` |
| DOC-005 | `GET` | `/api/v1/documents/{id}/download-url` | `DocumentController#downloadUrl` | `document:download` | No | `com/edam/documents/controller/DocumentController.java` |
| DOC-006 | `GET` | `/api/v1/documents/{id}/scans` | `DocumentController#scans` | `document:download` | No | `com/edam/documents/controller/DocumentController.java` |
| **Notification events** | | | | | | |
| EVT-001 | `GET` | `/api/v1/communication/events` | `NotificationEventConfigController#list` | `notification-template:manage` | No | `com/edam/communication/controller/NotificationEventConfigController.java` |
| EVT-002 | `PUT` | `/api/v1/communication/events/{eventCode}` | `NotificationEventConfigController#update` | `notification-template:manage` | Yes | `com/edam/communication/controller/NotificationEventConfigController.java` |
| **Integrations** | | | | | | |
| INT-001 | `GET` | `/api/v1/integrations` | `IntegrationController#list` | `integration:view` | No | `com/edam/integrations/controller/IntegrationController.java` |
| INT-002 | `POST` | `/api/v1/integrations` | `IntegrationController#create` | `integration:manage` | Yes | `com/edam/integrations/controller/IntegrationController.java` |
| INT-003 | `GET` | `/api/v1/integrations/executions/{execId}` | `IntegrationController#executionDetail` | `integration:view` | No | `com/edam/integrations/controller/IntegrationController.java` |
| INT-004 | `POST` | `/api/v1/integrations/executions/{execId}/retry` | `IntegrationController#retry` | `integration:execute` | Yes | `com/edam/integrations/controller/IntegrationController.java` |
| INT-005 | `GET` | `/api/v1/integrations/providers` | `IntegrationController#providers` | `integration:view` | No | `com/edam/integrations/controller/IntegrationController.java` |
| INT-006 | `GET` | `/api/v1/integrations/{id}` | `IntegrationController#detail` | `integration:view` | No | `com/edam/integrations/controller/IntegrationController.java` |
| INT-007 | `PUT` | `/api/v1/integrations/{id}` | `IntegrationController#update` | `integration:manage` | Yes | `com/edam/integrations/controller/IntegrationController.java` |
| INT-008 | `DELETE` | `/api/v1/integrations/{id}` | `IntegrationController#archive` | `integration:manage` | Yes | `com/edam/integrations/controller/IntegrationController.java` |
| INT-009 | `POST` | `/api/v1/integrations/{id}/activate` | `IntegrationController#activate` | `integration:manage` | Yes | `com/edam/integrations/controller/IntegrationController.java` |
| INT-010 | `POST` | `/api/v1/integrations/{id}/deactivate` | `IntegrationController#deactivate` | `integration:manage` | Yes | `com/edam/integrations/controller/IntegrationController.java` |
| INT-011 | `GET` | `/api/v1/integrations/{id}/executions` | `IntegrationController#history` | `integration:view` | No | `com/edam/integrations/controller/IntegrationController.java` |
| INT-012 | `POST` | `/api/v1/integrations/{id}/executions` | `IntegrationController#execute` | `integration:execute` | Yes | `com/edam/integrations/controller/IntegrationController.java` |
| INT-013 | `POST` | `/api/v1/integrations/{id}/test` | `IntegrationController#test` | `integration:test` | Yes | `com/edam/integrations/controller/IntegrationController.java` |
| **Approval limits** | | | | | | |
| LIM-001 | `GET` | `/api/v1/approval-limits` | `ApprovalLimitController#list` | `approval-limit:view` | No | `com/edam/approvallimits/controller/ApprovalLimitController.java` |
| LIM-002 | `POST` | `/api/v1/approval-limits` | `ApprovalLimitController#create` | `approval-limit:manage` | Yes | `com/edam/approvallimits/controller/ApprovalLimitController.java` |
| LIM-003 | `POST` | `/api/v1/approval-limits/authority-check` | `ApprovalLimitController#checkAuthority` | `approval-limit:view` | Yes | `com/edam/approvallimits/controller/ApprovalLimitController.java` |
| LIM-004 | `GET` | `/api/v1/approval-limits/{id}` | `ApprovalLimitController#get` | `approval-limit:view` | No | `com/edam/approvallimits/controller/ApprovalLimitController.java` |
| LIM-005 | `PUT` | `/api/v1/approval-limits/{id}` | `ApprovalLimitController#update` | `approval-limit:manage` | Yes | `com/edam/approvallimits/controller/ApprovalLimitController.java` |
| LIM-006 | `POST` | `/api/v1/approval-limits/{id}/activation` | `ApprovalLimitController#setActive` | `approval-limit:manage` | Yes | `com/edam/approvallimits/controller/ApprovalLimitController.java` |
| LIM-007 | `GET` | `/api/v1/exceeding-limit-rules` | `ExceedingLimitRuleController#list` | `exceeding-limit:view` | No | `com/edam/approvallimits/controller/ExceedingLimitRuleController.java` |
| LIM-008 | `POST` | `/api/v1/exceeding-limit-rules` | `ExceedingLimitRuleController#create` | `exceeding-limit:manage` | Yes | `com/edam/approvallimits/controller/ExceedingLimitRuleController.java` |
| LIM-009 | `GET` | `/api/v1/exceeding-limit-rules/evaluation` | `ExceedingLimitRuleController#evaluate` | `exceeding-limit:view` | No | `com/edam/approvallimits/controller/ExceedingLimitRuleController.java` |
| LIM-010 | `GET` | `/api/v1/exceeding-limit-rules/{id}` | `ExceedingLimitRuleController#get` | `exceeding-limit:view` | No | `com/edam/approvallimits/controller/ExceedingLimitRuleController.java` |
| LIM-011 | `PUT` | `/api/v1/exceeding-limit-rules/{id}` | `ExceedingLimitRuleController#update` | `exceeding-limit:manage` | Yes | `com/edam/approvallimits/controller/ExceedingLimitRuleController.java` |
| LIM-012 | `POST` | `/api/v1/exceeding-limit-rules/{id}/activation` | `ExceedingLimitRuleController#setActive` | `exceeding-limit:manage` | Yes | `com/edam/approvallimits/controller/ExceedingLimitRuleController.java` |
| LIM-013 | `GET` | `/api/v1/recommending-authorities` | `RecommendingAuthorityController#list` | `recommending-authority:view` | No | `com/edam/approvallimits/controller/RecommendingAuthorityController.java` |
| LIM-014 | `POST` | `/api/v1/recommending-authorities` | `RecommendingAuthorityController#create` | `recommending-authority:manage` | Yes | `com/edam/approvallimits/controller/RecommendingAuthorityController.java` |
| LIM-015 | `GET` | `/api/v1/recommending-authorities/resolved` | `RecommendingAuthorityController#resolved` | `recommending-authority:view` | No | `com/edam/approvallimits/controller/RecommendingAuthorityController.java` |
| LIM-016 | `GET` | `/api/v1/recommending-authorities/{id}` | `RecommendingAuthorityController#get` | `recommending-authority:view` | No | `com/edam/approvallimits/controller/RecommendingAuthorityController.java` |
| LIM-017 | `PUT` | `/api/v1/recommending-authorities/{id}` | `RecommendingAuthorityController#update` | `recommending-authority:manage` | Yes | `com/edam/approvallimits/controller/RecommendingAuthorityController.java` |
| LIM-018 | `POST` | `/api/v1/recommending-authorities/{id}/activation` | `RecommendingAuthorityController#setActive` | `recommending-authority:manage` | Yes | `com/edam/approvallimits/controller/RecommendingAuthorityController.java` |
| **Master data** | | | | | | |
| MST-001 | `GET` | `/api/v1/master-data/currencies` | `MasterDataController#currencies` | `currency:view` | No | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-002 | `POST` | `/api/v1/master-data/currencies` | `MasterDataController#createCurrency` | `currency:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-003 | `PUT` | `/api/v1/master-data/currencies/{id}` | `MasterDataController#updateCurrency` | `currency:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-004 | `POST` | `/api/v1/master-data/currencies/{id}/activation` | `MasterDataController#setCurrencyActive` | `currency:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-005 | `GET` | `/api/v1/master-data/exchange-rates` | `MasterDataController#exchangeRates` | `currency:view` | No | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-006 | `POST` | `/api/v1/master-data/exchange-rates` | `MasterDataController#createRate` | `currency:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-007 | `POST` | `/api/v1/master-data/exchange-rates/{id}/close` | `MasterDataController#closeRate` | `currency:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-008 | `GET` | `/api/v1/master-data/tax-authorities` | `MasterDataController#taxAuthorities` | `currency:view` | No | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-009 | `POST` | `/api/v1/master-data/tax-authorities` | `MasterDataController#createTaxAuthority` | `tax-authority:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-010 | `PUT` | `/api/v1/master-data/tax-authorities/{id}` | `MasterDataController#updateTaxAuthority` | `tax-authority:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-011 | `POST` | `/api/v1/master-data/tax-authorities/{id}/activation` | `MasterDataController#setTaxAuthorityActive` | `tax-authority:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-012 | `GET` | `/api/v1/master-data/vendors` | `MasterDataController#vendors` | `vendor:view` | No | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-013 | `POST` | `/api/v1/master-data/vendors` | `MasterDataController#createVendor` | `vendor:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-014 | `GET` | `/api/v1/master-data/vendors/{id}` | `MasterDataController#vendor` | `vendor:view` | No | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-015 | `PUT` | `/api/v1/master-data/vendors/{id}` | `MasterDataController#updateVendor` | `vendor:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| MST-016 | `POST` | `/api/v1/master-data/vendors/{id}/activation` | `MasterDataController#setVendorActive` | `vendor:manage` | Yes | `com/edam/masterdata/controller/MasterDataController.java` |
| **Notifications** | | | | | | |
| NTF-001 | `GET` | `/api/v1/notifications` | `NotificationInboxController#list` | `notification:view` | No | `com/edam/communication/controller/NotificationInboxController.java` |
| NTF-002 | `POST` | `/api/v1/notifications/read-all` | `NotificationInboxController#markAllRead` | `notification:view` | Yes | `com/edam/communication/controller/NotificationInboxController.java` |
| NTF-003 | `GET` | `/api/v1/notifications/unread-count` | `NotificationInboxController#unreadCount` | `notification:view` | No | `com/edam/communication/controller/NotificationInboxController.java` |
| NTF-004 | `POST` | `/api/v1/notifications/{id}/read` | `NotificationInboxController#markRead` | `notification:view` | Yes | `com/edam/communication/controller/NotificationInboxController.java` |
| **Organization** | | | | | | |
| ORG-001 | `GET` | `/api/v1/organization/branches` | `OrganizationController#branches` | `organization:view` | No | `com/edam/organization/controller/OrganizationController.java` |
| ORG-002 | `POST` | `/api/v1/organization/branches` | `OrganizationController#createBranch` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-003 | `PUT` | `/api/v1/organization/branches/{id}` | `OrganizationController#updateBranch` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-004 | `POST` | `/api/v1/organization/branches/{id}/activation` | `OrganizationController#setBranchActive` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-005 | `GET` | `/api/v1/organization/departments` | `OrganizationController#departments` | `organization:view` | No | `com/edam/organization/controller/OrganizationController.java` |
| ORG-006 | `POST` | `/api/v1/organization/departments` | `OrganizationController#createDepartment` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-007 | `PUT` | `/api/v1/organization/departments/{id}` | `OrganizationController#updateDepartment` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-008 | `POST` | `/api/v1/organization/departments/{id}/activation` | `OrganizationController#setDepartmentActive` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-009 | `GET` | `/api/v1/organization/profile` | `OrganizationController#getProfile` | `organization:view` | No | `com/edam/organization/controller/OrganizationController.java` |
| ORG-010 | `POST` | `/api/v1/organization/profile` | `OrganizationController#createProfile` | `configuration:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-011 | `PATCH` | `/api/v1/organization/profile` | `OrganizationController#updateProfile` | `configuration:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-012 | `GET` | `/api/v1/organization/unit-types` | `OrganizationController#unitTypes` | `organization:view` | No | `com/edam/organization/controller/OrganizationController.java` |
| ORG-013 | `GET` | `/api/v1/organization/units` | `OrganizationController#units` | `organization:view` | No | `com/edam/organization/controller/OrganizationController.java` |
| ORG-014 | `POST` | `/api/v1/organization/units` | `OrganizationController#createUnit` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-015 | `GET` | `/api/v1/organization/units/tree` | `OrganizationController#tree` | `organization:view` | No | `com/edam/organization/controller/OrganizationController.java` |
| ORG-016 | `PUT` | `/api/v1/organization/units/{id}` | `OrganizationController#updateUnit` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| ORG-017 | `POST` | `/api/v1/organization/units/{id}/activation` | `OrganizationController#setUnitActive` | `organization:manage` | Yes | `com/edam/organization/controller/OrganizationController.java` |
| **Expense requests** | | | | | | |
| REQ-001 | `GET` | `/api/v1/expense-requests` | `ExpenseRequestController#list` | `request:view-own` | No | `com/edam/expenserequest/controller/ExpenseRequestController.java` |
| REQ-002 | `POST` | `/api/v1/expense-requests` | `ExpenseRequestController#create` | `request:create` | Yes | `com/edam/expenserequest/controller/ExpenseRequestController.java` |
| REQ-003 | `GET` | `/api/v1/expense-requests/{id}` | `ExpenseRequestController#get` | `request:view-own` | No | `com/edam/expenserequest/controller/ExpenseRequestController.java` |
| REQ-004 | `PUT` | `/api/v1/expense-requests/{id}` | `ExpenseRequestController#update` | `request:edit` | Yes | `com/edam/expenserequest/controller/ExpenseRequestController.java` |
| REQ-005 | `GET` | `/api/v1/expense-requests/{id}/activity` | `RequestTimelineController#timeline` | `request:view-own` | No | `com/edam/audit/controller/RequestTimelineController.java` |
| REQ-006 | `POST` | `/api/v1/expense-requests/{id}/cancel` | `ExpenseRequestController#cancel` | `request:cancel` | Yes | `com/edam/expenserequest/controller/ExpenseRequestController.java` |
| REQ-007 | `POST` | `/api/v1/expense-requests/{id}/submit` | `ExpenseRequestController#submit` | `request:submit` | Yes | `com/edam/expenserequest/controller/ExpenseRequestController.java` |
| **Roles** | | | | | | |
| ROL-001 | `GET` | `/api/v1/roles` | `RoleController#list` | `role:view` | No | `com/edam/rolemanagement/controller/RoleController.java` |
| ROL-002 | `POST` | `/api/v1/roles` | `RoleController#create` | `role:manage` | Yes | `com/edam/rolemanagement/controller/RoleController.java` |
| ROL-003 | `GET` | `/api/v1/roles/permissions` | `RoleController#catalogue` | `role:view` | No | `com/edam/rolemanagement/controller/RoleController.java` |
| ROL-004 | `GET` | `/api/v1/roles/{id}` | `RoleController#get` | `role:view` | No | `com/edam/rolemanagement/controller/RoleController.java` |
| ROL-005 | `PUT` | `/api/v1/roles/{id}` | `RoleController#update` | `role:manage` | Yes | `com/edam/rolemanagement/controller/RoleController.java` |
| ROL-006 | `POST` | `/api/v1/roles/{id}/activation` | `RoleController#setActive` | `role:manage` | Yes | `com/edam/rolemanagement/controller/RoleController.java` |
| ROL-007 | `PUT` | `/api/v1/roles/{id}/permissions` | `RoleController#setPermissions` | `role:manage` | Yes | `com/edam/rolemanagement/controller/RoleController.java` |
| **Reports & dashboard** | | | | | | |
| RPT-001 | `GET` | `/api/v1/reporting/dashboard` | `ReportingController#dashboard` | `report:view` | No | `com/edam/reporting/controller/ReportingController.java` |
| RPT-002 | `POST` | `/api/v1/reporting/expense-requests/export` | `ReportingController#export` | `report:export` | Yes | `com/edam/reporting/controller/ReportingController.java` |
| RPT-003 | `GET` | `/api/v1/reporting/expense-requests/register` | `ReportingController#register` | `report:view` | No | `com/edam/reporting/controller/ReportingController.java` |
| RPT-004 | `GET` | `/api/v1/reporting/reports` | `ReportingController#reportCatalogue` | `dashboard:manage` | No | `com/edam/reporting/controller/ReportingController.java` |
| RPT-005 | `GET` | `/api/v1/reporting/widgets` | `ReportingController#widgetCatalogue` | `dashboard:manage` | No | `com/edam/reporting/controller/ReportingController.java` |
| **SMTP** | | | | | | |
| SMT-001 | `GET` | `/api/v1/communication/smtp` | `SmtpConfigurationController#get` | `email-configuration:manage` | No | `com/edam/communication/controller/SmtpConfigurationController.java` |
| SMT-002 | `POST` | `/api/v1/communication/smtp` | `SmtpConfigurationController#save` | `email-configuration:manage` | Yes | `com/edam/communication/controller/SmtpConfigurationController.java` |
| SMT-003 | `DELETE` | `/api/v1/communication/smtp/active` | `SmtpConfigurationController#deactivate` | `email-configuration:manage` | Yes | `com/edam/communication/controller/SmtpConfigurationController.java` |
| SMT-004 | `POST` | `/api/v1/communication/smtp/test` | `SmtpConfigurationController#test` | `email-configuration:manage` | Yes | `com/edam/communication/controller/SmtpConfigurationController.java` |
| **System** | | | | | | |
| SYS-001 | `GET` | `/api/v1/system/info` | `SystemController#info` | authenticated (any logged-in user) | No | `com/edam/web/SystemController.java` |
| **Email templates** | | | | | | |
| TPL-001 | `GET` | `/api/v1/communication/email-templates` | `EmailTemplateController#list` | `notification-template:manage` | No | `com/edam/communication/controller/EmailTemplateController.java` |
| TPL-002 | `POST` | `/api/v1/communication/email-templates` | `EmailTemplateController#create` | `notification-template:manage` | Yes | `com/edam/communication/controller/EmailTemplateController.java` |
| TPL-003 | `GET` | `/api/v1/communication/email-templates/{id}` | `EmailTemplateController#get` | `notification-template:manage` | No | `com/edam/communication/controller/EmailTemplateController.java` |
| TPL-004 | `PUT` | `/api/v1/communication/email-templates/{id}/active` | `EmailTemplateController#setActive` | `notification-template:manage` | Yes | `com/edam/communication/controller/EmailTemplateController.java` |
| TPL-005 | `POST` | `/api/v1/communication/email-templates/{id}/preview` | `EmailTemplateController#preview` | `notification-template:manage` | Yes | `com/edam/communication/controller/EmailTemplateController.java` |
| TPL-006 | `GET` | `/api/v1/communication/email-templates/{id}/versions` | `EmailTemplateController#history` | `notification-template:manage` | No | `com/edam/communication/controller/EmailTemplateController.java` |
| TPL-007 | `POST` | `/api/v1/communication/email-templates/{id}/versions` | `EmailTemplateController#newVersion` | `notification-template:manage` | Yes | `com/edam/communication/controller/EmailTemplateController.java` |
| **Users** | | | | | | |
| USR-001 | `GET` | `/api/v1/users` | `UserController#list` | `user:view` | No | `com/edam/usermanagement/controller/UserController.java` |
| USR-002 | `POST` | `/api/v1/users` | `UserController#create` | `user:manage` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| USR-003 | `GET` | `/api/v1/users/search` | `UserController#search` | `user:view` | No | `com/edam/usermanagement/controller/UserController.java` |
| USR-004 | `GET` | `/api/v1/users/{id}` | `UserController#get` | `user:view` | No | `com/edam/usermanagement/controller/UserController.java` |
| USR-005 | `PUT` | `/api/v1/users/{id}` | `UserController#update` | `user:manage` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| USR-006 | `POST` | `/api/v1/users/{id}/activation` | `UserController#setActive` | `user:manage` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| USR-007 | `GET` | `/api/v1/users/{id}/effective-permissions` | `UserController#effectivePermissions` | `user:view` | No | `com/edam/usermanagement/controller/UserController.java` |
| USR-008 | `POST` | `/api/v1/users/{id}/password-reset` | `UserController#triggerPasswordReset` | `user:manage` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| USR-009 | `GET` | `/api/v1/users/{id}/roles` | `UserController#roles` | `user:view` | No | `com/edam/usermanagement/controller/UserController.java` |
| USR-010 | `POST` | `/api/v1/users/{id}/roles` | `UserController#assignRole` | `user-role:assign` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| USR-011 | `DELETE` | `/api/v1/users/{id}/roles/{assignmentId}` | `UserController#revokeRole` | `user-role:assign` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| USR-012 | `POST` | `/api/v1/users/{id}/scopes` | `UserController#assignScope` | `data-scope:manage` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| USR-013 | `DELETE` | `/api/v1/users/{id}/scopes/{scopeId}` | `UserController#removeScope` | `data-scope:manage` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| USR-014 | `POST` | `/api/v1/users/{id}/unlock` | `UserController#unlock` | `user:manage` | Yes | `com/edam/usermanagement/controller/UserController.java` |
| **Workflow configuration** | | | | | | |
| WF-001 | `GET` | `/api/v1/workflows` | `WorkflowConfigurationController#list` | `workflow:view` | No | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-002 | `POST` | `/api/v1/workflows` | `WorkflowConfigurationController#create` | `workflow:manage` | Yes | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-003 | `GET` | `/api/v1/workflows/versions/compare` | `WorkflowConfigurationController#compare` | `workflow:view` | No | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-004 | `GET` | `/api/v1/workflows/versions/{versionId}` | `WorkflowConfigurationController#version` | `workflow:view` | No | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-005 | `POST` | `/api/v1/workflows/versions/{versionId}/publish` | `WorkflowConfigurationController#publish` | `workflow:publish` | Yes | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-006 | `POST` | `/api/v1/workflows/versions/{versionId}/retire` | `WorkflowConfigurationController#retire` | `workflow:publish` | Yes | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-007 | `GET` | `/api/v1/workflows/versions/{versionId}/validate` | `WorkflowConfigurationController#validate` | `workflow:view` | No | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-008 | `PUT` | `/api/v1/workflows/{definitionId}` | `WorkflowConfigurationController#update` | `workflow:manage` | Yes | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-009 | `POST` | `/api/v1/workflows/{definitionId}/active` | `WorkflowConfigurationController#setActive` | `workflow:manage` | Yes | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-010 | `PUT` | `/api/v1/workflows/{definitionId}/draft` | `WorkflowConfigurationController#saveDraft` | `workflow:manage` | Yes | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-011 | `POST` | `/api/v1/workflows/{definitionId}/draft/from-published` | `WorkflowConfigurationController#clonePublished` | `workflow:manage` | Yes | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-012 | `POST` | `/api/v1/workflows/{definitionId}/draft/from-version/{sourceVersionId}` | `WorkflowConfigurationController#rollbackIntoDraft` | `workflow:manage` | Yes | `com/edam/workflow/controller/WorkflowConfigurationController.java` |
| WF-013 | `GET` | `/api/v1/workflows/{definitionId}/versions` | `WorkflowConfigurationController#versions` | `workflow:view` | No | `com/edam/workflow/controller/WorkflowConfigurationController.java` |

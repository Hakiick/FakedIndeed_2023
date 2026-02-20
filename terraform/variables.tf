variable "env" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.env)
    error_message = "env must be one of: dev, staging, prod."
  }
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "swedencentral"
  validation {
    condition     = contains(["uksouth", "swedencentral", "polandcentral", "switzerlandnorth", "germanywestcentral"], var.location)
    error_message = "location must be one of: uksouth, swedencentral, polandcentral, switzerlandnorth, germanywestcentral."
  }
}

variable "project_name" {
  description = "Project name used in resource naming (lowercase letters, digits, hyphens only)"
  type        = string
  default     = "fakedindeed"
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "project_name must contain only lowercase letters, digits, and hyphens."
  }
}

variable "sku_name" {
  description = "App Service Plan SKU (F1=free, B1/B2/B3=basic, S1/S2/S3=standard)"
  type        = string
  default     = "B1"
  validation {
    condition     = contains(["F1", "B1", "B2", "B3", "S1", "S2", "S3"], var.sku_name)
    error_message = "sku_name must be one of: F1, B1, B2, B3, S1, S2, S3."
  }
}

variable "subscription_id" {
  description = "Azure subscription ID (UUID format, run: az account show --query id -o tsv)"
  type        = string
  validation {
    condition     = can(regex("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", var.subscription_id))
    error_message = "subscription_id must be a valid UUID (e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)."
  }
}

variable "node_version" {
  description = "Node.js version for the App Service runtime"
  type        = string
  default     = "20-lts"
  validation {
    condition     = contains(["18-lts", "20-lts", "22-lts"], var.node_version)
    error_message = "node_version must be one of: 18-lts, 20-lts, 22-lts."
  }
}

variable "mysql_admin_login" {
  description = "MySQL administrator login name (lowercase letters and digits only, not 'admin' or 'root')"
  type        = string
  default     = "mysqladmin"
  validation {
    condition     = can(regex("^[a-z0-9]+$", var.mysql_admin_login)) && !contains(["admin", "root"], var.mysql_admin_login)
    error_message = "mysql_admin_login must contain only lowercase letters and digits, and must not be 'admin' or 'root'."
  }
}

variable "mysql_admin_password" {
  description = "MySQL administrator password (minimum 8 characters)"
  type        = string
  sensitive   = true
  validation {
    condition     = length(var.mysql_admin_password) >= 8
    error_message = "mysql_admin_password must be at least 8 characters long."
  }
}

variable "mysql_sku_name" {
  description = "MySQL Flexible Server SKU (burstable tiers for cost-conscious deployments)"
  type        = string
  default     = "B_Standard_B1ms"
  validation {
    condition     = contains(["B_Standard_B1ms", "B_Standard_B2ms", "B_Standard_B4ms", "B_Standard_B8ms"], var.mysql_sku_name)
    error_message = "mysql_sku_name must be one of: B_Standard_B1ms, B_Standard_B2ms, B_Standard_B4ms, B_Standard_B8ms."
  }
}

variable "mysql_version" {
  description = "MySQL server version"
  type        = string
  default     = "8.0.21"
}

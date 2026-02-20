locals {
  resource_prefix = "${var.project_name}-${var.env}"
  tags = {
    project     = var.project_name
    environment = var.env
    managed_by  = "terraform"
  }
}

resource "azurerm_resource_group" "main" {
  name     = "rg-${local.resource_prefix}"
  location = var.location
  tags     = local.tags
}

resource "azurerm_service_plan" "main" {
  name                = "asp-${local.resource_prefix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.sku_name
  tags                = local.tags
}

resource "azurerm_linux_web_app" "fakedindeed" {
  name                = "app-${local.resource_prefix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id
  https_only          = true
  tags                = local.tags

  site_config {
    always_on                         = var.sku_name != "F1"
    http2_enabled                     = true
    minimum_tls_version               = "1.2"
    ftps_state                        = "Disabled"
    health_check_path                 = "/api/health"
    health_check_eviction_time_in_min = 10

    app_command_line = "node server.js"

    application_stack {
      node_version = var.node_version
    }
  }

  app_settings = {
    NODE_ENV                       = "production"
    PORT                           = "3000"
    NEXT_TELEMETRY_DISABLED        = "1"
    SCM_DO_BUILD_DURING_DEPLOYMENT = "false"
    MYSQL_HOST                     = azurerm_mysql_flexible_server.main.fqdn
    MYSQL_PORT                     = "3306"
    MYSQL_DATABASE                 = azurerm_mysql_flexible_database.main.name
    MYSQL_USER                     = var.mysql_admin_login
    MYSQL_PASSWORD                 = var.mysql_admin_password
    MYSQL_SSL                      = "true"
  }
}

resource "azurerm_mysql_flexible_server" "main" {
  name                         = "mysql-${local.resource_prefix}"
  resource_group_name          = azurerm_resource_group.main.name
  location                     = azurerm_resource_group.main.location
  administrator_login          = var.mysql_admin_login
  administrator_password       = var.mysql_admin_password
  sku_name                     = var.mysql_sku_name
  version                      = var.mysql_version
  zone                         = "1"
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  tags                         = local.tags
}

resource "azurerm_mysql_flexible_database" "main" {
  name                = "jobboard"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_unicode_ci"
}

resource "azurerm_mysql_flexible_server_firewall_rule" "allow_azure" {
  name                = "AllowAzureServices"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

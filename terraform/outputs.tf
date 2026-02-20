output "app_url" {
  description = "Public HTTPS URL of the FakedIndeed App Service"
  value       = "https://${azurerm_linux_web_app.fakedindeed.default_hostname}"
}

output "mysql_fqdn" {
  description = "Fully qualified domain name of the MySQL Flexible Server"
  value       = azurerm_mysql_flexible_server.main.fqdn
}

output "mysql_database" {
  description = "Name of the MySQL database"
  value       = azurerm_mysql_flexible_database.main.name
}

output "resource_group_name" {
  description = "Name of the Azure resource group containing all resources"
  value       = azurerm_resource_group.main.name
}

﻿using System;
using middlerApp.API.Helper;
using Reflectensions.ExtensionMethods;

namespace middlerApp.API
{
    public class StartUpConfiguration
    {
        public string ListeningIP { get; set; } = "0.0.0.0";
        public int? HttpPort { get; set; } = 80;
        public int? HttpsPort { get; set; } = 443;
        public string HttpsCertPath { get; set; } = "localhost.pfx";
        public string HttpsCertPassword { get; set; } = "ABC12abc";
        public string WebRoot { get; set; } = "wwwroot";
        
        public StartUpAdminConfiguration AdminSettings { get; } = new StartUpAdminConfiguration();

        public EndpointRulesConfiguration EndpointRulesSettings { get; } = new EndpointRulesConfiguration();

        public GlobalVariablesConfiguration GlobalVariablesSettings { get; } = new GlobalVariablesConfiguration();

        public StartUpConfiguration SetDefaultSettings()
        {
            AdminSettings.ListeningIP = AdminSettings.ListeningIP?.Trim().ToNull() ?? ListeningIP;
            AdminSettings.HttpsPort = AdminSettings.HttpsPort != 0 ? AdminSettings.HttpsPort : 4444;
            AdminSettings.HttpsCertPath = AdminSettings.HttpsCertPath?.Trim().ToNull() ?? HttpsCertPath;
            AdminSettings.HttpsCertPassword = AdminSettings.HttpsCertPassword?.Trim().ToNull() ?? HttpsCertPassword;

            EndpointRulesSettings.DbFilePath = EndpointRulesSettings.DbFilePath?.Trim().ToNull() ?? "DefaultStorage/rules.db";

            GlobalVariablesSettings.RootPath = GlobalVariablesSettings.RootPath?.Trim().ToNull() ?? "DefaultStorage/variables";

            return this;
        }
    }

    public class StartUpAdminConfiguration
    {
        public string ListeningIP { get; set; } = "0.0.0.0";
        public int HttpsPort { get; set; } = 4444;
        public string HttpsCertPath { get; set; }
        public string HttpsCertPassword { get; set; }

        
    }

    public class EndpointRulesConfiguration
    {
        public string DbFilePath { get; set; }
    }

    public class GlobalVariablesConfiguration
    {
        public string RootPath { get; set; }
    }




}

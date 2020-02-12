﻿using System;
using Microsoft.Extensions.DependencyInjection;
using middler.Common.Actions.UrlRedirect;
using middler.Common.Interfaces;

namespace middler.Common.Actions.UrlRewrite
{
    public static class UrlRewriteActionExtensions
    {
        public static IMiddlerOptionsBuilder AddUrlRewriteAction(this IMiddlerOptionsBuilder optionsBuilder, string alias = null)
        {
            alias = !String.IsNullOrWhiteSpace(alias) ? alias : UrlRewriteAction.DefaultActionType;
            optionsBuilder.ServiceCollection.AddTransient<UrlRewriteAction>();
            optionsBuilder.RegisterAction<UrlRewriteAction>(alias);

            return optionsBuilder;
        }
        
    }
}
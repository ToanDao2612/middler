﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using middler.Action.Scripting.ExtensionMethods;
using middler.Action.Scripting.Javascript;
using middler.Action.Scripting.Powershell;
using middler.Action.Scripting.Shared;
using middler.Action.Scripting.Typescript;
using middler.Common.SharedModels.Models;

namespace middler.Action.Scripting
{
    public class ScriptingAction: MiddlerAction<ScriptingOptions>
    {
        internal static string DefaultActionType => "Script";
        public override string ActionType => DefaultActionType;

        public async Task ExecuteRequestAsync(HttpContext httpContext)
        {

            IScriptEngine scriptEngine = GetScriptEngine();
            
           

            
            var scriptContextMethods = new ScriptContextMethods();
            scriptContextMethods.SendResponse = () =>
            {
                Console.WriteLine("Test von Action");
                scriptEngine.Stop();
            };

            var scriptContext = new ScriptContext(httpContext, scriptContextMethods);
           

            scriptEngine.Initialize();
            scriptEngine.SetValue("Context", scriptContext);

            try
            {
                await scriptEngine.Execute(scriptEngine.NeedsCompiledScript ? Parameters.CompiledCode : Parameters.SourceCode);
                await SendResponse(httpContext, scriptContext);
            }
            catch (Exception e)
            {
                await httpContext.BadRequest(e.GetBaseException().Message);
            }
            
            
        }


        private async Task SendResponse(HttpContext httpContext, ScriptContext scriptContext)
        {
            var statusCode = scriptContext.Response.StatusCode ?? 200;
            await httpContext.StatusCode(statusCode, scriptContext.Response.Body);
        }


        private IScriptEngine GetScriptEngine()
        {
            switch (Parameters.Language)
            {
                case ScriptLanguage.Javascript:
                {
                   return new JavascriptEngine();
                }
                case ScriptLanguage.Powershell:
                {
                    return new PowershellEngine();
                }
                case ScriptLanguage.Typescript:
                {
                    return new TypescriptEngine();
                }
                default:
                {
                    throw new NotImplementedException();
                }
            }

        }

        public void CompileScriptIfNeeded()
        {
            IScriptEngine scriptEngine = GetScriptEngine();
            if (scriptEngine.NeedsCompiledScript)
            {
                scriptEngine.CompileScript?.Invoke(Parameters);
            }
        }
    }
}
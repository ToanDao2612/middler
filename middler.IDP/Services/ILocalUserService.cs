﻿using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using middler.IDP.Models;

namespace middler.IDP.Services
{
    public interface ILocalUserService
    { 
        //Task<bool> ValidateClearTextCredentialsAsync(
        //    string userName, 
        //    string password);
        Task<bool> ValidateCredentialsAsync(
            string userName,
            string password);
        Task<IEnumerable<MUserClaim>> GetUserClaimsBySubjectAsync(
            string subject);         
        Task<MUser> GetUserByUserNameAsync(
            string userName);
        Task<MUser> GetUserBySubjectAsync(
            string subject);        
        //void AddUser
        //    (MUser userToAdd);
        void AddUser(
            MUser userToAdd,
            string password);
        Task<bool> IsUserActive(
            string subject);
        Task<bool> ActivateUser(
            string securityCode);
        Task<bool> SaveChangesAsync();
        Task<string> InitiatePasswordResetRequest(
            string email);
        Task<bool> SetPassword(
            string securityCode,
            string password);
        Task<MUser> GetUserByExternalProvider(
            string provider,
            string providerIdentityKey);
        MUser ProvisionUserFromExternalIdentity(
            string provider,
            string providerIdentityKey,
            IEnumerable<Claim> claims);
        Task AddExternalProviderToUser(
            string subject,
            string provider,
            string providerIdentityKey);
        Task<bool> AddUserSecret(
            string subject, 
            string name, 
            string secret);
        Task<MUserSecret> GetUserSecret(
            string subject,
            string name);
        Task<bool> UserHasRegisteredTotpSecret(
            string subject);
    }
}
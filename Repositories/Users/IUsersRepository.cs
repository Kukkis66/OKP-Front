using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OKPBackend.Models.Domain;
using OKPBackend.Models.DTO.Users;

namespace OKPBackend.Repositories.Users
{
    public interface IUsersRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> CreateAsync(UserRegisterDto userRegisterDto);

        Task<User?> GetByUsername(UserLoginDto userLoginDto);
    }
}
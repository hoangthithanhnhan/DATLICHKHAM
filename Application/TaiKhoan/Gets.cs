using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.TaiKhoan
{
    public class Gets
    {
        public class Query:IRequest<Result<IEnumerable<AppUser>>>
        {
            public string Keyword;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<AppUser>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<AppUser>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@Keyword", request.Keyword);
                        var result = await connection.QueryAsync<AppUser>("SP_Gets_User", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<AppUser>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<AppUser>>.Failure(ex.Message);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
        }
    }
}

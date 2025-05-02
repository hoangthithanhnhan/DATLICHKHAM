using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.BenhNhan
{
    public class Gets
    {
        public class Query:IRequest<Result<IEnumerable<DLK_BenhNhan>>>
        {
            public string filter;
            public bool? trangthai;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_BenhNhan>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_BenhNhan>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@keyword", request.filter);
                        parameters.Add("@trangthai", request.trangthai);
                        var result = await connection.QueryAsync<DLK_BenhNhan>("SP_Gets_BenhNhan", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_BenhNhan>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_BenhNhan>>.Failure(ex.Message);
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

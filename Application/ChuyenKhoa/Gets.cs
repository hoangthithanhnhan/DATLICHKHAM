using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenKhoa
{
    public class Gets
    {
        public class Query : IRequest<Result<IEnumerable<DLK_ChuyenKhoa>>>
        {
            public string filter;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_ChuyenKhoa>>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_ChuyenKhoa>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@keyword", request.filter);    
                        var result = await connection.QueryAsync<DLK_ChuyenKhoa>("SP_Gets_ChuyenKhoa", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_ChuyenKhoa>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_ChuyenKhoa>>.Failure(ex.Message);
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

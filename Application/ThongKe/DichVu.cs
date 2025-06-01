using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ThongKe
{
    public class DichVu
    {
        public class Query:IRequest<Result<IEnumerable<DLK_ThongKe_DichVu>>>
        {
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_ThongKe_DichVu>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_ThongKe_DichVu>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryAsync<DLK_ThongKe_DichVu>("SP_ThongKe_DichVu", null, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_ThongKe_DichVu>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_ThongKe_DichVu>>.Failure(ex.Message);
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

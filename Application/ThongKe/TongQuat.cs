using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ThongKe
{
    public class TongQuat
    {
        public class Query:IRequest<Result<DLK_ThongKe>>
        {
        }
        public class Handler : IRequestHandler<Query, Result<DLK_ThongKe>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ThongKe>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ThongKe>("SP_ThongKe_TongQuat", null, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ThongKe>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ThongKe>.Failure(ex.Message);
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

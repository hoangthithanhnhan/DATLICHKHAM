using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ThongKe
{
    public class DoanhThu
    {
        public class Query:IRequest<Result<IEnumerable<DLK_ThongKe_DoanhThu>>>
        {
            public int Nam { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_ThongKe_DoanhThu>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_ThongKe_DoanhThu>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@Nam", request.Nam);
                        var result = await connection.QueryAsync<DLK_ThongKe_DoanhThu>("SP_ThongKe_DoanhThu", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_ThongKe_DoanhThu>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_ThongKe_DoanhThu>>.Failure(ex.Message);
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

using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ThongKe
{
    public class ChuyenGia
    {
        public class Query:IRequest<Result<IEnumerable<DLK_ThongKe_ChuyenGia>>>
        {
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_ThongKe_ChuyenGia>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_ThongKe_ChuyenGia>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryAsync<DLK_ThongKe_ChuyenGia>("SP_ThongKe_ChuyenGia", null, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_ThongKe_ChuyenGia>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_ThongKe_ChuyenGia>>.Failure(ex.Message);
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

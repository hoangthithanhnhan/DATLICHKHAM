using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.LichLamViecChuyenGia
{
    public class Get
    {
        public class Query : IRequest<Result<DLK_LichLamViecChuyenGia>>
        {
            public int MaLichLamViec;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_LichLamViecChuyenGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_LichLamViecChuyenGia>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters= new DynamicParameters();
                        parameters.Add("@MaLichLamViec", request.MaLichLamViec);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_LichLamViecChuyenGia>("SP_Get_LichLamViecChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_LichLamViecChuyenGia>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_LichLamViecChuyenGia>.Failure(ex.Message);
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

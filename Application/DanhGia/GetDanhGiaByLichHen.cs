using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DATLICHKHAM.Application.DanhGia
{
    public class GetDanhGiaByLichHen
    {
        public class Query : IRequest<Result<DLK_DanhGia>>
        {
            public int MaLichHen;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_DanhGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_DanhGia>> Handle(Query request, CancellationToken cancellationToken)
            {
                using( var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaLichHen", request.MaLichHen);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_DanhGia>("SP_Get_DanhGiaByLichHen", parameters, commandType: CommandType.StoredProcedure);
                        return Result<DLK_DanhGia>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_DanhGia>.Failure(ex.Message);
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

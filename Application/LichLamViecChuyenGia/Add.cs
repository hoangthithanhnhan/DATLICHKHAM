using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.LichLamViecChuyenGia
{
    public class Add
    {
        public class Command: IRequest<Result<DLK_LichLamViecChuyenGia>>
        {
            public DLK_LichLamViecChuyenGiaAdd Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_LichLamViecChuyenGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_LichLamViecChuyenGia>> Handle(Command request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenGia", request.Entity.MaChuyenGia);
                        parameters.Add("@Ngay", request.Entity.Ngay);
                        parameters.Add("@ThoiGianLamViec", request.Entity.ThoiGianLamViec);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_LichLamViecChuyenGia>("SP_Add_LichLamViecChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
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

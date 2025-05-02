using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.LichHen
{
    public class Add
    {
        public class Command : IRequest<Result<DLK_LichHen>>
        {
            public DLK_LichHenAdd Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_LichHen>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_LichHen>> Handle(Command request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenGia", request.Entity.MaChuyenGia);
                        parameters.Add("@MaBenhNhan", request.Entity.MaBenhNhan);
                        parameters.Add("@NgayHen", request.Entity.NgayHen);
                        parameters.Add("@MaDichVu", request.Entity.MaDichVu);
                        parameters.Add("@ThoiGianHen", request.Entity.ThoiGianHen);
                        parameters.Add("@HinhThucKham", request.Entity.HinhThucKham);
                        parameters.Add("@LyDoHuyLich", request.Entity.LyDoHuyLich);
                        parameters.Add("@GhiChu", request.Entity.GhiChu);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_LichHen>("SP_Add_LichHen", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_LichHen>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_LichHen>.Failure(ex.Message);
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

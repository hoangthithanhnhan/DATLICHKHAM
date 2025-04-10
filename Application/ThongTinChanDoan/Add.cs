using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ThongTinChanDoan
{
    public class Add
    {
        public class Command : IRequest<Result<DLK_ThongTinChanDoan>>
        {
            public DLK_ThongTinChanDoanAdd Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_ThongTinChanDoan>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ThongTinChanDoan>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaLichHen", request.Entity.MaLichHen);
                        parameters.Add("@TinhTrangHienTai", request.Entity.TinhTrangHienTai);
                        parameters.Add("@ChanDoan", request.Entity.ChanDoan);
                        parameters.Add("@HuongDieuTri", request.Entity.HuongDieuTri);
                        var result = await connection.QuerySingleOrDefaultAsync<DLK_ThongTinChanDoan>("SP_Add_ThongTinChanDoan", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ThongTinChanDoan>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ThongTinChanDoan>.Failure(ex.Message);
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

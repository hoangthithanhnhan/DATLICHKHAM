using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenGia
{
    public class Add
    {
        public class Command : IRequest<Result<DLK_ChuyenGia>>
        {
            public DLK_ChuyenGiaAddInfo Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_ChuyenGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration )
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChuyenGia>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaNguoiDung", request.Entity.MaNguoiDung);
                        parameters.Add("@HoTen", request.Entity.HoTen);
                        parameters.Add("@GioiTinh", request.Entity.GioiTinh);
                        parameters.Add("@NgaySinh", request.Entity.NgaySinh);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ChuyenGia>("SP_Add_ChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChuyenGia>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ChuyenGia>.Failure(ex.Message);
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

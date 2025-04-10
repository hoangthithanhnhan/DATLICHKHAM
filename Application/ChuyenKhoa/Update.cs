using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenKhoa
{
    public class Update
    {
        public class Command : IRequest<Result<DLK_ChuyenKhoa>>
        {
            public DLK_ChuyenKhoa Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_ChuyenKhoa>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChuyenKhoa>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenKhoa", request.Entity.MaChuyenKhoa);
                        parameters.Add("@TenChuyenKhoa", request.Entity.TenChuyenKhoa);
                        parameters.Add("@MoTa", request.Entity.MoTa);
                        parameters.Add("@TrangThai", request.Entity.TrangThai);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ChuyenKhoa>("SP_Update_ChuyenKhoa", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChuyenKhoa>.Success(result);
                    }
                    catch (Exception ex) { return Result<DLK_ChuyenKhoa>.Failure(ex.Message); }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
        }
    }
}

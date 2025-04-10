using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenMuc
{
    public class Update
    {
        public class Command : IRequest<Result<DLK_ChuyenMuc>>
        {
            public DLK_ChuyenMuc Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_ChuyenMuc>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChuyenMuc>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenMuc", request.Entity.MaChuyenMuc);
                        parameters.Add("@TenChuyenMuc", request.Entity.TenChuyenMuc);
                        parameters.Add("@MoTa", request.Entity.MoTa);
                        parameters.Add("@TrangThai", request.Entity.TrangThai);
                        parameters.Add("@AnhDaiDien", request.Entity.AnhDaiDien);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ChuyenMuc>("SP_Update_ChuyenMuc", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChuyenMuc>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ChuyenMuc>.Failure(ex.Message);
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

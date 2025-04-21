using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.BaiViet
{
    public class Update
    {
        public class Command : IRequest<Result<DLK_BaiViet>>
        {
            public DLK_BaiViet Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_BaiViet>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_BaiViet>> Handle(Command request, CancellationToken cancellationToken)
            {
                using( var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaBaiViet", request.Entity.MaBaiViet); 
                        parameters.Add("@MaChuyenMuc", request.Entity.MaChuyenMuc);
                        parameters.Add("@TieuDe", request.Entity.TieuDe);
                        parameters.Add("@NoiDung", request.Entity.NoiDung);
                        parameters.Add("@TrangThai", request.Entity.TrangThai);
                        parameters.Add("@TomTat", request.Entity.TomTat);
                        parameters.Add("@AnhDaiDien", request.Entity.AnhDaiDien);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_BaiViet>("SP_Update_BaiViet", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_BaiViet>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_BaiViet>.Failure(ex.Message);
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

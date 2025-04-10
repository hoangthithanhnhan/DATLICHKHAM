using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.DichVu
{
    public class Add
    {
        public class Commnad : IRequest<Result<DLK_DichVu>>
        {
            public DLK_DichVuAdd Entity;
        }
        public class Handler : IRequestHandler<Commnad, Result<DLK_DichVu>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_DichVu>> Handle(Commnad request, CancellationToken cancellationToken)
            {
                using ( var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@TenDichVu", request.Entity.TenDichVu);
                        parameters.Add("@MoTa", request.Entity.MoTa);
                        parameters.Add("@TrangThai", request.Entity.TrangThai);
                        parameters.Add("@GiaDichVu", request.Entity.GiaDichVu);
                        parameters.Add("@AnhDaiDien", request.Entity.AnhDaiDien);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_DichVu>("SP_Add_DichVu", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_DichVu>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_DichVu>.Failure(ex.Message);
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

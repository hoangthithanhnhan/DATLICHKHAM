using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.DanhGia
{
    public class Add
    {
        public class Command : IRequest<Result<DLK_DanhGia>>
        {
            public DLK_DanhGiaAdd Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_DanhGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_DanhGia>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaLichHen", request.Entity.MaLichHen);
                        parameters.Add("@NoiDung", request.Entity.NoiDung);
                        parameters.Add("@SoSao", request.Entity.SoSao);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_DanhGia>("SP_Add_DanhGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
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

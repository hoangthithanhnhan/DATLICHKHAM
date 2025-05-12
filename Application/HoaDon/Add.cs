using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.HoaDon
{
    public class Add
    {
        public class Command : IRequest<Result<DLK_HoaDon>>
        {
            public DLK_HoaDonAdd Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_HoaDon>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_HoaDon>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaLichHen", request.Entity.MaLichHen);
                        parameters.Add("@TongTien", request.Entity.TongTien);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_HoaDon>("SP_Add_HoaDon", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_HoaDon>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_HoaDon>.Failure(ex.Message);
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

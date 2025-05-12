using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.LichHen
{
    public class HuyLichHen
    {
        public class Command : IRequest<Result<DLK_LichHenUpdate>>
        {
            public DLK_LichHenUpdate Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_LichHenUpdate>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_LichHenUpdate>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaLichHen", request.Entity.MaLichHen);
                        parameters.Add("@LyDoHuyLich", request.Entity.LyDoHuyLich);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_LichHenUpdate>("SP_HuyLichHen", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_LichHenUpdate>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_LichHenUpdate>.Failure(ex.Message);
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

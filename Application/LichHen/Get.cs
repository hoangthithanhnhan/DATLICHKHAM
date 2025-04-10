using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.LichHen
{
    public class Get
    {
        public class Query : IRequest<Result<DLK_LichHen>>
        {
            public int MaLichHen;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_LichHen>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_LichHen>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaLichHen", request.MaLichHen);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_LichHen>("SP_Get_LichHen",parameters, commandType: System.Data.CommandType.StoredProcedure);
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

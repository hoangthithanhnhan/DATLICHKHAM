using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.LichHen
{
    public class Gets
    {
        public class Query : IRequest<Result<IEnumerable<DLK_LichHen>>>
        {
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_LichHen>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_LichHen>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryAsync<DLK_LichHen>("SP_Gets_LichHen", commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_LichHen>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_LichHen>>.Failure(ex.Message);
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

using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ThongTinChanDoan
{
    public class Get
    {
        public class Query : IRequest<Result<DLK_ThongTinChanDoan>>
        {
            public int MaChanDoan;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_ThongTinChanDoan>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ThongTinChanDoan>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChanDoan", request.MaChanDoan);
                        var result = await connection.QuerySingleOrDefaultAsync<DLK_ThongTinChanDoan>("SP_Get_ThongTinChanDoan", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ThongTinChanDoan>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ThongTinChanDoan>.Failure(ex.Message);
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

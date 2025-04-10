using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ThongTinChanDoan
{
    public class Gets
    {
        public class Query: IRequest<Result<IEnumerable<DLK_ThongTinChanDoan>>>
        {
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_ThongTinChanDoan>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_ThongTinChanDoan>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryAsync<DLK_ThongTinChanDoan>("SP_Gets_ThongTinChanDoan", commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_ThongTinChanDoan>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_ThongTinChanDoan>>.Failure(ex.Message);
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

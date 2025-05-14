using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.BaiViet
{
    public class GetTop1BaiVietMoiNhat
    {
        public class Query : IRequest<Result<DLK_BaiViet>>
        {
        }
        public class Handler : IRequestHandler<Query, Result<DLK_BaiViet>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_BaiViet>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_BaiViet>("SP_Gets_TOP1BaiVietMoiNhat", null, commandType: System.Data.CommandType.StoredProcedure);
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

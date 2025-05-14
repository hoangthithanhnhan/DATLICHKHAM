using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.BaiViet
{
    public class GetTop3BaiVietMoiNhat_SauTop1
    {
        public class Query : IRequest<Result<IEnumerable<DLK_BaiViet>>>
        {
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_BaiViet>>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_BaiViet>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryAsync<DLK_BaiViet>("SP_Gets_TOP3BaiVietMoiNhat_SauTop1", null, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_BaiViet>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_BaiViet>>.Failure(ex.Message);
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

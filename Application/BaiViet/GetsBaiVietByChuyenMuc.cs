using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DATLICHKHAM.Application.BaiViet
{
    public class GetsBaiVietByChuyenMuc
    {
        public class Query : IRequest<Result<IEnumerable<DLK_BaiViet>>>
        {
            public int? MaChuyenMuc;
            public int? PageIndex;
            public int? PageSize;
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
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenMuc", request.MaChuyenMuc);
                        parameters.Add("@PageIndex", request.PageIndex);
                        parameters.Add("@PageSize", request.PageSize);

                        var result = await connection.QueryAsync<DLK_BaiViet>(
                            "SP_Gets_BaiVietTheoChuyenMuc",
                            parameters,
                            commandType: CommandType.StoredProcedure
                        );

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

using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenGia
{
    public class Gets
    {
        public class Query: IRequest<Result<IEnumerable<DLK_ChuyenGia>>>
        {
            public DLK_ChuyenGiaRequestFilter filter;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_ChuyenGia>>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_ChuyenGia>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@keyword", request.filter.Keyword);
                        var result = await connection.QueryAsync<DLK_ChuyenGia>("SP_Gets_ChuyenGia",parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_ChuyenGia>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_ChuyenGia>>.Failure(ex.Message);
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

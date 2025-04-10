using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenMuc
{
    public class Get
    {
        public class Query : IRequest<Result<DLK_ChuyenMuc>>
        {
            public int MaChuyenMuc;
        }
       public class Handler : IRequestHandler<Query, Result<DLK_ChuyenMuc>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChuyenMuc>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenMuc", request.MaChuyenMuc);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ChuyenMuc>("SP_Get_ChuyenMuc", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChuyenMuc>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ChuyenMuc>.Failure(ex.Message);
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

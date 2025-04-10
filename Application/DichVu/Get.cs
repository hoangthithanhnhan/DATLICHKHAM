using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.DichVu
{
    public class Get
    {
        public class Query : IRequest<Result<DLK_DichVu>>
        {
            public int MaDichVu;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_DichVu>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_DichVu>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaDichVu", request.MaDichVu);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_DichVu>("SP_Get_DichVu",parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_DichVu>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_DichVu>.Failure(ex.Message);
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

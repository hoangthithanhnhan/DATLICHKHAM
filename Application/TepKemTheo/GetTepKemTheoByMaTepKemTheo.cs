using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.TepKemTheo
{
    public class GetTepKemTheoByMaTepKemTheo
    {
        public class Query: IRequest<Result<DLK_TepDinhKem>>
        {
            public int MaTepDinhKem;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_TepDinhKem>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_TepDinhKem>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaTepDinhKem", request.MaTepDinhKem);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_TepDinhKem>("SP_Get_TepDinhKemByMaTepDinhKem", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_TepDinhKem>.Success(result);
                    }
                    catch (Exception ex) 
                    {
                        return Result<DLK_TepDinhKem>.Failure(ex.Message);
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

using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.TepKemTheo
{
    public class GetTepKemTheoByMaDoiTuong
    {
        public class Query: IRequest<Result<IEnumerable<DLK_TepDinhKem>>>
        {
            public Guid MaDoiTuong;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_TepDinhKem>>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_TepDinhKem>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using ( var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaDoiTuong", request.MaDoiTuong);
                        var result = await connection.QueryAsync<DLK_TepDinhKem>("SP_Get_TepDinhKemByMaDoiTuong", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_TepDinhKem>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_TepDinhKem>>.Failure(ex.Message);
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

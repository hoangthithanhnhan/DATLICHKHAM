using Application.Core;
using Dapper;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.LichHen
{
    public class Delete
    {
        public class Commnad: IRequest<Result<int>>
        {
            public int MaLichHen;
        }
        public class Handler : IRequestHandler<Commnad, Result<int>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<int>> Handle(Commnad request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaLichHen", request.MaLichHen);
                        var result = await connection.ExecuteAsync("SP_Delete_LichHen",parameters , commandType: System.Data.CommandType.StoredProcedure);
                        return Result<int>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<int>.Failure(ex.Message);
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

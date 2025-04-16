using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DATLICHKHAM.Application.TepKemTheo
{
    
    public class AddTepKemTheo
    {
        public class Command : IRequest<Result<DLK_TepDinhKem>>
        {
            public DLK_TepDinhKemAddModel Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<DLK_TepDinhKem>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_TepDinhKem>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaDoiTuong", request.Entity.MaDoiTuong);
                        parameters.Add("@TenFile", request.Entity.TenFile);
                        parameters.Add("@DuongDan", request.Entity.DuongDan);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_TepDinhKem>("SP_Add_TepKemTheo", parameters, commandType: CommandType.StoredProcedure);
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

using Application.Core;
using Dapper;
using MediatR;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DATLICHKHAM.Application.BenhNhan
{
    public class Delete
    {
        public class Command : IRequest<Result<int>>
        {
            public int MaBenhNhan;
        }
        public class Handler : IRequestHandler<Command, Result<int>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<int>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaBenhNhan", request.MaBenhNhan);
                        var result = await connection.ExecuteAsync("SP_Delete_BenhNhan", parameters, commandType: CommandType.StoredProcedure);
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

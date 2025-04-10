using Application.Core;
using Dapper;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChungChiChuyenGia
{
    public class Delete
    {
        public class Command : IRequest<Result<int>>
        {
            public Guid MaChungChi;
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
                        parameters.Add("@MaChungChi", request.MaChungChi);
                        var result = await connection.ExecuteAsync("SP_Delete_ChungChiChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
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

using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenKhoa
{
    public class Get
    {
        public class Query : IRequest<Result<DLK_ChuyenKhoa>>
        {
            public int MaChuyenKhoa;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_ChuyenKhoa>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChuyenKhoa>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenKhoa", request.MaChuyenKhoa);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ChuyenKhoa>("SP_Get_ChuyenKhoa", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChuyenKhoa>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ChuyenKhoa>.Failure(ex.Message);
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

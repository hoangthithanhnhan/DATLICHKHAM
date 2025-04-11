using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenGia
{
    public class Get
    {
        public class Query : IRequest<Result<DLK_ChuyenGia>>
        {
            public int MaNguoiDung;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_ChuyenGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChuyenGia>> Handle(Query request, CancellationToken cancellationToken)
            {
                using ( var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaNguoiDung", request.MaNguoiDung);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ChuyenGia>("SP_Get_ChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChuyenGia>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ChuyenGia>.Failure(ex.Message);
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

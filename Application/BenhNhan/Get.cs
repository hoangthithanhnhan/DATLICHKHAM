using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DATLICHKHAM.Application.BenhNhan
{
    public class Get
    {
        public class Query : IRequest<Result<DLK_BenhNhan>>
        {
            public int? MaBenhNhan;
            public string? MaNguoiDung;
        }
        public class Handler : IRequestHandler<Query, Result<DLK_BenhNhan>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_BenhNhan>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaBenhNhan", request.MaBenhNhan);
                        parameters.Add("@MaNguoiDung", request.MaNguoiDung);
                        var result = await connection.QuerySingleOrDefaultAsync<DLK_BenhNhan>("SP_Get_BenhNhan", parameters, commandType: CommandType.StoredProcedure);
                        return Result<DLK_BenhNhan>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_BenhNhan>.Failure(ex.Message);
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
